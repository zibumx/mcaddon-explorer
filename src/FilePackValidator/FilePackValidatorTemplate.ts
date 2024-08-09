import { type ContentBundle } from "../ContentPack/ContentPack";

abstract class FilePackValidatorTemplate {
  abstract getFilePackType(type: ContentBundle): string | undefined;
}

export { FilePackValidatorTemplate };
