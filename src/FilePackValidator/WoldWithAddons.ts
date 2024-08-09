import type { ContentBundle } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class WorldWithAddonsValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "world_with_addon" | undefined {
    if (type.contentPacks.length !== 0) return;
    if (type.worldPacks.length !== 1) return;

    const worldPack = type.worldPacks[0];

    if (
      worldPack.activeBehaviorPacks.length <= 0 ||
      worldPack.activeResourcePacks.length <= 0
    )
      return;
    return "world_with_addon";
  }
}

export { WorldWithAddonsValidator };
