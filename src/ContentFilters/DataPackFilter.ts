import type { ContentPack } from "../ContentPack";
import { ContentFilter } from "./ContentFilter";

class DataPackFilter extends ContentFilter {
    contentType: string = "data";

    async filter(content: ContentPack): Promise<true | string> {
        const manifest = content.manifest;
        if(
            manifest.modules.find((module) => module.type === "data")
        ) return true;
        return "No data module found in manifest.json";
    }
}

export { DataPackFilter };