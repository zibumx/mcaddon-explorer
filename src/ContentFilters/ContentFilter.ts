import type { ContentPack } from "../ContentPack/ContentPack";

abstract class ContentFilter {
  abstract contentType: string;

  abstract filter(content: ContentPack): true | string;

  abstract getInsights(contentPack: ContentPack): any;
}

export { ContentFilter };
