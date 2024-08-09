import { z } from "zod";

// Vector type to handle version arrays
const versionSchema = z.union([
  z.array(z.number()).length(3),
  z.string().regex(/^\d+\.\d+\.\d+$/), // SemVer string format
  z.string().regex(/^\d+\.\d+\.\d+-.+$/), // SemVer string format with pre-release
]);

// UUID type to handle UUIDs
const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  );

// Header schema
const headerSchema = z.object({
  allow_random_seed: z.boolean().optional(),
  base_game_version: versionSchema.optional(),
  description: z.string().optional(),
  lock_template_options: z.boolean().optional(),
  min_engine_version: versionSchema.optional(),
  name: z.string(),
  pack_scope: z.enum(["world", "global", "any"]).optional(),
  uuid: uuidSchema,
  version: versionSchema,
});

// Modules schema
const modulesSchema = z.object({
  description: z.string().optional(),
  type: z.enum(["resources", "data", "world_template", "script", "skin_pack"]),
  uuid: uuidSchema,
  version: versionSchema.optional(),
  language: z.enum(["javascript"]).optional(),
});

// Dependencies schema
const dependenciesSchema = z.object({
  uuid: uuidSchema.optional(),
  module_name: z.string().optional(),
  version: z.union([versionSchema, z.string()]),
});

// Capabilities schema
const capabilitiesSchema = z.array(
  z.enum([
    "chemistry",
    "editorExtension",
    "experimental_custom_ui",
    "raytraced",
    "pbr",
    "script_eval",
  ])
);

// Metadata schema
const metadataSchema = z.object({
  authors: z.array(z.string()).optional(),
  license: z.string().optional(),
  generated_with: z
    .record(
      z
        .string()
        .regex(/^[a-zA-Z0-9_-]{1,32}$/)
        .optional(),
      z.union([
        z
          .string()
          .regex(/^\d+\.\d+\.\d+$/)
          .optional(),
        z.array(z.string()).optional(),
      ])
    )
    .optional(),
  product_type: z.enum(["addon"]).optional(),
  url: z.string().url().optional(),
});

export const ManifestValidator = z.object({
  format_version: z.number().min(1).max(2),
  header: headerSchema,
  modules: z.array(modulesSchema),
  dependencies: z.array(dependenciesSchema).optional(),
  capabilities: capabilitiesSchema.optional(),
  metadata: metadataSchema.optional(),
});

export type Manifest = z.infer<typeof ManifestValidator>;
