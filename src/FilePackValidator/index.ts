import { AddonMultiPackValidator } from "./AddonMultiPack";
import { AddonFilePackValidator } from "./AddonPack";
import { BehaviorPackValidator } from "./BehaviorPack";
import { ScriptPackValidator } from "./ScriptPack";
import { TexturePackValidator } from "./TexturePack";
import { UnknownPackValidator } from "./UnknownPack";
import { WorldWithAddonsValidator } from "./WoldWithAddons";
import { WorldPackValidator } from "./WorldPack";
import { WorldTemplateValidator } from "./WorldTemplate";
import { WorldWithBehaviorValidator } from "./WorldWithBehavior";

const validators = [
  new WorldPackValidator(),
  new WorldWithAddonsValidator(),
  new WorldWithBehaviorValidator(),

  new AddonFilePackValidator(),
  new BehaviorPackValidator(),
  new AddonMultiPackValidator(),
  new ScriptPackValidator(),
  new TexturePackValidator(),
  new WorldTemplateValidator(),
  new UnknownPackValidator(),
];

export default validators;
