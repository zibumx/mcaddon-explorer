import { ContentPack } from "../ContentPack";
import { AddonFilePackValidator } from "./AddonPack";
import { BehaviorPackValidator } from "./BehaviorPack";
import { ScriptPackValidator } from "./ScriptPack";
import { TexturePackValidator } from "./TexturePack";

abstract class FilePackValidatorTemplate {
  abstract getFilePackType(type: ContentPack[]): string | undefined;
}

export { FilePackValidatorTemplate };
