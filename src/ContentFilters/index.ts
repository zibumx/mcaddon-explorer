import { DataPackFilter } from "./DataPackFilter";
import { ScriptFilter } from "./ScriptFilter";
import { SkinPackFilter } from "./SkinPackFilter";
import { ResourceFilter } from "./TextureFilter";
import { WorldTemplateFilter } from "./WorldTemplateFilter";

const validators = [
  new ScriptFilter(),
  new ResourceFilter(),
  new SkinPackFilter(),
  new DataPackFilter(),
  new WorldTemplateFilter(),
];

export default validators;
