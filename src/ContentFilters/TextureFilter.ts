import type { ContentPack } from "../ContentPack";
import { ContentFilter } from "./ContentFilter";

class ResourceFilter extends ContentFilter {
  contentType: string = "resources";

  async filter(content: ContentPack): Promise<true | string> {
    const manifest = content.manifest;
    if (manifest.modules.find((module) => module.type === "resources"))
      return true;
    return "No resources module found in manifest.json";
  }
}

export { ResourceFilter };
