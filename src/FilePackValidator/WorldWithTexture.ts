import type { ContentBundle } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class WorldWithTexture extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "world_with_texture" | undefined {
    if (type.contentPacks.length !== 0) return;
    if (type.worldPacks.length !== 1) return;

    const worldPack = type.worldPacks[0];

    if (worldPack.activeBehaviorPacks.length !== 0) return;
    if (worldPack.activeResourcePacks.length === 0) return;
    return "world_with_texture";
  }
}

export { WorldWithTexture };
