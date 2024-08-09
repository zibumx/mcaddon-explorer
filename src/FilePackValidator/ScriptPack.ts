import type { ContentBundle, ContentPack } from "../ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class ScriptPackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "script" | undefined {
    const contentPacks = type.contentPacks;
    if (contentPacks.length !== 1) return;
    if (
      contentPacks.find(
        (content) => content.getType().contentType === "script"
      ) === undefined
    )
      return;
    return "script";
  }
}

export { ScriptPackValidator };
