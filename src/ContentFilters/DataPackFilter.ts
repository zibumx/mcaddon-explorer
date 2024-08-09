import type { ContentPack } from "../ContentPack/ContentPack";
import { ContentFilter } from "./ContentFilter";

class DataPackFilter extends ContentFilter {
  contentType: string = "data";

  filter(content: ContentPack): true | string {
    const manifest = content.manifest;
    if (manifest.modules.find((module) => module.type === "data")) return true;
    return "No data module found in manifest.json";
  }

  getInsights(contentPack: ContentPack) {
    return {};
  }
}

export { DataPackFilter };
