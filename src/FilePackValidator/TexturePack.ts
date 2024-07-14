import type { ContentPack } from "../ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class TexturePackValidator extends FilePackValidatorTemplate {
    getFilePackType(type: ContentPack[]): "texture" | undefined {
        if(type.length !== 1) return;
        if(type.find((content) => content.getType().contentType === "resources") === undefined) return;
        return "texture";
    }
}

export { TexturePackValidator };