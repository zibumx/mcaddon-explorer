import type { ContentPack } from "../ContentPack";
import { AddonFilePackValidator } from "./AddonPack";
import { BehaviorPackValidator } from "./BehaviorPack";
import { ScriptPackValidator } from "./ScriptPack";
import { TexturePackValidator } from "./TexturePack";

class FilePackValidator {
  static validators = [
    new AddonFilePackValidator(),
    new BehaviorPackValidator(),
    new ScriptPackValidator(),
    new TexturePackValidator(),
  ];

  static validate(filePack: ContentPack[]) {
    for (const validator of this.validators) {
      const type = validator.getFilePackType(filePack);
      if (type !== undefined) return type;
    }
  }
}

export { FilePackValidator };