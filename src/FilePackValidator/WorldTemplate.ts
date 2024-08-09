import type { ContentBundle, ContentPack } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class WorldTemplateValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): string | undefined {
    const contentPacks = type.contentPacks;
    if (contentPacks.length !== 1) return;
    if (
      contentPacks.find(
        (content) => content.getType().contentType === "world_template"
      ) === undefined
    )
      return;
    return "world_template";
  }
}

export { WorldTemplateValidator };
