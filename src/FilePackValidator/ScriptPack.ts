import type { ContentPack } from "../ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class ScriptPackValidator extends FilePackValidatorTemplate {
    getFilePackType(type: ContentPack[]): "script" | undefined {
        if(type.length !== 1) return;
        if(type.find((content) => content.getType().contentType === "script") === undefined) return;
        return "script";
    }
}

export { ScriptPackValidator };