import type { ContentPack } from "../ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class AddonFilePackValidator extends FilePackValidatorTemplate {
    getFilePackType(type: ContentPack[]): "addon" | undefined {
        if(type.length !== 2) return;
        if(type.find((content) => content.getType().contentType === "data" || content.getType().contentType === "script") === undefined) return;
        if(type.find((content) => content.getType().contentType === "resources") === undefined) return;
        return "addon";
    }
}

export { AddonFilePackValidator };