import type { ContentBundle, ContentPack } from "../ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class BehaviorPackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "behavior" | undefined {
    const contentPacks = type.contentPacks;
    if (contentPacks.length !== 1) return;
    if (
      contentPacks.find(
        (content) => content.getType().contentType === "data"
      ) === undefined
    )
      return;
    return "behavior";
  }
}

export { BehaviorPackValidator };
