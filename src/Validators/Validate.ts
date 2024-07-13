import type AdmZip from "adm-zip";
import type { ZodType } from "zod";

function validateEntry<T extends ZodType>(
  entry: AdmZip.IZipEntry,
  validator: T
): ReturnType<T["safeParse"]> {
  const content = JSON.parse(entry.getData().toString("utf-8"));
  return validator.safeParse(content) as ReturnType<T["safeParse"]>;
}

export { validateEntry };
