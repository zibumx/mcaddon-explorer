// A multipack is a pack that contains one or more worlds and one or more content packs

import type { ContentBundle } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class WorldWithTexture extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "multipack" | undefined {
    if (type.contentPacks.length !== 0) return;
    if (type.worldPacks.length !== 0) return;

    return "multipack";
  }
}

export { WorldWithTexture };
