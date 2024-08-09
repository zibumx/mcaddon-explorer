import type { ContentBundle } from "../ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class TexturePackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "texture" | undefined {
    const contentPacks = type.contentPacks;
    if (contentPacks.length !== 1) return;
    if (
      contentPacks.find(
        (content) => content.getType().contentType === "resources"
      ) === undefined
    )
      return;
    return "texture";
  }
}

export { TexturePackValidator };
