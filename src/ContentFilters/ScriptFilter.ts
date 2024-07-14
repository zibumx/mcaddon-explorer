import type { ContentPack } from "../ContentPack";
import { ContentFilter } from "./ContentFilter";

class ScriptFilter extends ContentFilter {
    contentType: string = "script";
    
    async filter(content: ContentPack): Promise<true | string> {
        const manifest = content.manifest;
        if(
            manifest.modules.find((module) => module.type === "script")
        ) return true;
        return "No script module found in manifest.json";
    }

    getInsights(contentPack: ContentPack) {
        
    }
}

export { ScriptFilter };