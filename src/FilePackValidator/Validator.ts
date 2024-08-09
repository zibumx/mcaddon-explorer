import type { WorldPack } from "@/World/WorldPack";
import validators from ".";
import type { ContentBundle } from "../ContentPack/ContentPack";

class FilePackValidator {
  static validators = validators;

  static validate(filePack: ContentBundle) {
    for (const validator of this.validators) {
      const type = validator.getFilePackType(filePack);
      if (type !== undefined) return type;
    }
  }
}

export { FilePackValidator };
