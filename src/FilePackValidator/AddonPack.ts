import { WorldPack } from "@/World/WorldPack";
import type { ContentBundle, ContentPack } from "../ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class AddonFilePackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "addon" | undefined {
    const contentPacks = type.contentPacks;
    if (contentPacks.length !== 2) return;
    if (
      contentPacks.find(
        (content) =>
          content.getType().contentType === "data" ||
          content.getType().contentType === "script"
      ) === undefined
    )
      return;
    if (
      contentPacks.find(
        (content) => content.getType().contentType === "resources"
      ) === undefined
    )
      return;
    return "addon";
  }
}

export { AddonFilePackValidator };
