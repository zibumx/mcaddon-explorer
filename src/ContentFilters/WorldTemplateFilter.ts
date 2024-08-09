import type { ContentPack } from "@/ContentPack/ContentPack";
import { ContentFilter } from "./ContentFilter";

class WorldTemplateFilter extends ContentFilter {
  contentType: string = "world_template";
  filter(content: ContentPack): true | string {
    const manifest = content.manifest;
    if (manifest.modules.find((module) => module.type === "world_template")) {
      return true;
    }
    return "No world template module found in manifest.json";
  }

  getInsights(contentPack: ContentPack) {}
}

export { WorldTemplateFilter };
