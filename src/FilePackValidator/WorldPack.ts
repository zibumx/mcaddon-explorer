import type { ContentBundle } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class WorldPackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "world" | undefined {
    if (type.contentPacks.length !== 0) return;
    if (type.worldPacks.length !== 1) return;

    const worldPacks = type.worldPacks[0];

    if (worldPacks.resourcePacks.length !== 0) return;
    if (worldPacks.behaviorPacks.length !== 0) return;
    return "world";
  }
}

export { WorldPackValidator };
