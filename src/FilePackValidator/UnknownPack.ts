import { ContentPack, type ContentBundle } from "@/ContentPack/ContentPack";
import { FilePackValidatorTemplate } from "./FilePackValidatorTemplate";

class UnknownPackValidator extends FilePackValidatorTemplate {
  getFilePackType(type: ContentBundle): "unknown" {
    console.error("===================================");
    console.error("Error validating the following content packs:");
    const translations = type.contentPacks.map((pack) => pack.languageFiles);

    for (const pack of type.contentPacks) {
      console.error(pack.getType());
      console.error(
        "- Pack name: ",
        ContentPack.getTranslation({
          text: pack.name,
          languages: translations,
        })
      );
    }

    console.error("With the following worlds:");

    for (const world of type.worldPacks) {
      console.error("- ", world.worldData.LevelName);
    }
    console.error("===================================");
    return "unknown";
  }
}

export { UnknownPackValidator };
