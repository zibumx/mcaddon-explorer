import type { ContentPack } from "../ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class BehaviorPackValidator extends FilePackValidatorTemplate {
    getFilePackType(type: ContentPack[]): "behavior" | undefined {
        if(type.length !== 1) return;
        if(type.find((content) => content.getType().contentType === "data") === undefined) return;
        return "behavior";
    }
}

export { BehaviorPackValidator };