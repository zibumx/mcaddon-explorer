import type { ContentPack } from "../ContentPack/ContentPack";
import { skipPackSchema } from "../Validators/SkinsJson";
import { validateEntry } from "../Validators/Validate";
import { ContentFilter } from "./ContentFilter";

class SkinPackFilter extends ContentFilter {
  contentType: string = "skins";
  filter(content: ContentPack): true | string {
    const manifest = content.manifest;
    if (
      manifest.format_version !== 1 ||
      manifest.modules.find((module) => module.type === "skin_pack") ===
        undefined
    )
      return "No skin pack module found in manifest.json";

    const folder = content.getFolder();
    const skins = folder.getEntry("skins.json");
    if (!skins) return "No skins.json file found in the skin pack";

    const skinsContent = validateEntry(skins, skipPackSchema);

    if (skinsContent.success === false) return skinsContent.error.toString();

    return true;
  }

  getInsights(contentPack: ContentPack) {}
}

export { SkinPackFilter };
