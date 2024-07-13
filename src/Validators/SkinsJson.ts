import { z } from "zod";

const skinSchema = z.object({
  localization_name: z
    .string()
    .describe("The key in the language file to use to display text."),
  geometry: z
    .string()
    .regex(/^[Gg]eometry\..+$/, "Invalid geometry pattern")
    .describe("The type of geometry to use."),
  texture: z
    .string()
    .regex(/^.*\.png$/, "Texture must be a .png file")
    .describe("The filename of the skin."),
  type: z.enum(["free", "paid"]).describe("The type of skin."),
});

const skipPackSchema = z
  .object({
    serialize_name: z
      .string()
      .describe(
        "The name of the pack as an identifier, they must be the same as the name of pack without spaces."
      ),
    localization_name: z
      .string()
      .describe("The key in the language file to use to display text."),
    skins: z.array(skinSchema).describe("An array of item."),
  })
  .strict()
  .describe("Skin pack definition.");

export { skipPackSchema, skinSchema };
