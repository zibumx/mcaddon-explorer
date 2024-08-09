import type { ContentBundle, ContentPack } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class AddonMultiPackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "multiaddon" | undefined {
    const contentPacks = type.contentPacks;

    if (contentPacks.length < 2) return;
    const dataTypes: Record<string, number> = {};

    for (const content of contentPacks) {
      const dataType = content.getType().contentType;
      dataTypes[dataType] = (dataTypes[dataType] || 0) + 1;
    }

    const types = Object.keys(dataTypes);

    // Must contain:
    // - At least one data or script pack
    // - At least one resources pack
    if (
      types.find((type) => type !== "data" && type !== "script") ===
        undefined ||
      types.find((type) => type !== "resources") === undefined
    )
      return;

    // Must not contain any other type
    for (const type of types) {
      if (type !== "data" && type !== "script" && type !== "resources") {
        return;
      }
    }

    return "multiaddon";
  }
}

export { AddonMultiPackValidator };
