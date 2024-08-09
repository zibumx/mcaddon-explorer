import type { ContentPack } from "../ContentPack/ContentPack";
import { ContentFilter } from "./ContentFilter";

class ResourceFilter extends ContentFilter {
  contentType: string = "resources";

  filter(content: ContentPack): true | string {
    const manifest = content.manifest;
    if (manifest.modules.find((module) => module.type === "resources"))
      return true;
    return "No resources module found in manifest.json";
  }

  getInsights(contentPack: ContentPack) {
    return {};
  }
}

export { ResourceFilter };
