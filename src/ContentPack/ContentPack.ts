import AdmZip from "adm-zip";
import { ManifestValidator, type Manifest } from "../Validators/Manifest";
import type { ContentFilter } from "../ContentFilters/ContentFilter";
import { jsonrepair } from "jsonrepair";
import validators from "@/ContentFilters";
import { WorldPack } from "@/World/WorldPack";
import { removeMinecraftColors } from "@/utils";

type ContentBundle = {
  contentPacks: ContentPack[];
  worldPacks: WorldPack[];
};

class Folder {
  private zipEntries: AdmZip.IZipEntry[];
  private indexedEntries: Record<string, AdmZip.IZipEntry>;
  folderPath: string;

  constructor(entries: AdmZip.IZipEntry[], folderPath: string) {
    this.zipEntries = entries;
    this.folderPath = folderPath;
    const indexedEntries: Record<string, AdmZip.IZipEntry> = {};
    for (const entry of entries) {
      indexedEntries[entry.entryName] = entry;
    }
    this.indexedEntries = indexedEntries;
  }

  getAbsolutePath(path: string) {
    if (this.folderPath === "") return path;
    if (this.folderPath.endsWith("/")) {
      return `${this.folderPath}${path}`;
    }
    return `${this.folderPath}/${path}`;
  }

  getEntry(name: string) {
    return this.indexedEntries[this.getAbsolutePath(name)];
  }

  getFilesInFolders() {
    return this.zipEntries.filter((entry) => {
      // Remove the folder path from the entry name, but only at the beginning
      const entryName = entry.entryName.replace(this.folderPath, "");
      return entryName.includes("/");
    });
  }

  getEntries() {
    return this.zipEntries.filter((entry) =>
      entry.entryName.startsWith(this.folderPath)
    );
  }

  filterEntries(predicate: (entry: AdmZip.IZipEntry) => boolean) {
    return this.zipEntries.filter(predicate);
  }

  any(predicate: (entry: AdmZip.IZipEntry) => boolean) {
    return this.zipEntries.some(predicate);
  }

  find(predicate: (entry: AdmZip.IZipEntry) => boolean) {
    return this.zipEntries.find(predicate);
  }
}

/**
 * Represents a content pack.
 */
class ContentPack {
  private folder: Folder;

  manifest: Manifest;
  private _languageFiles: Record<string, Record<string, string>> | undefined;

  /**
   * Represents the filters used to validate content in a content pack.
   */
  static filters: ContentFilter[] = validators;

  /**
   * Retrieves the folder associated with the content pack.
   *
   * @returns The folder object.
   */
  getFolder(): Folder {
    return this.folder;
  }

  get languageFiles() {
    if (this._languageFiles) {
      return this._languageFiles as Record<string, Record<string, string>>;
    }
    const langFiles = this.folder.getEntries().filter((entry) => {
      return entry.entryName.endsWith(".lang");
    });

    const translations: Record<string, Record<string, string>> = {};

    langFiles.forEach((file) => {
      const translation: Record<string, string> = {};

      const language = file.name.split(".")[0];
      const content = file.getData().toString("utf-8");

      content.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        translation[key] = value;
      });

      translations[language] = translation;
    });

    this._languageFiles = translations;
    return translations;
  }

  /**
   * Represents a content pack.
   * @param entries - The folder containing the content pack entries.
   */
  constructor(entries: Folder) {
    this.folder = entries;

    // Check if a manifest exists
    const manifestEntry = this.folder.getEntry("manifest.json");
    if (!manifestEntry) {
      console.error(
        "Entries: ",
        this.folder.getEntries().map((e) => e.entryName)
      );
      throw new Error("No manifest entry found in the content pack");
    }

    try {
      const manifestText = manifestEntry.getData().toString("utf-8");
      var manifestContent = JSON.parse(jsonrepair(manifestText));
    } catch (error) {
      throw new Error("Failed to parse manifest.json: " + error);
    }

    try {
      this.manifest = ManifestValidator.parse(manifestContent);
    } catch (error) {
      console.error("Error on the following manifest: ", manifestContent);
      throw new Error("Failed to validate manifest.json: " + error);
    }
  }

  /**
   * Gets the name of the content pack from the manifest.
   * @returns The name of the content pack.
   */
  get name(): string {
    return this.manifest.header.name;
  }

  /**
   * Gets the description of the content pack from the manifest.
   * @returns The description of the content pack, or undefined if not available.
   */
  get description(): string | undefined {
    return this.manifest.header.description;
  }

  /**
   * Retrieves the translation for a given text from a list of languages.
   *
   * @param {object} options - The options for retrieving the translation.
   * @param {string} options.text - The text to be translated.
   * @param {Record<string, Record<string, string>> | Record<string, Record<string, string>>[]} options.languages - The list of languages containing the translations.
   * @param {boolean} [options.withMinecraftColors=false] - Whether to include Minecraft colors in the translated text. Default is false, which removes Minecraft colors.
   *
   * @returns {string} The translated text, or the original text if no translation is found.
   */
  static getTranslation({
    text,
    languages,
    withMinecraftColors = false,
  }: {
    text: string;
    languages:
      | Record<string, Record<string, string>>
      | Record<string, Record<string, string>>[];
    withMinecraftColors?: boolean;
  }) {
    var translations: Record<string, Record<string, string>>[] = [];
    if (!Array.isArray(languages)) {
      translations.push(languages);
    } else {
      translations = languages;
    }

    const returnText = (text: string) => {
      if (withMinecraftColors === false) {
        return removeMinecraftColors(text);
      }
      return text;
    };

    for (const languages of translations) {
      const languagePriorities = ["en_US", "es_ES"];

      // Search for an exact coincidence on language priorities
      for (const language of languagePriorities) {
        if (languages[language] && languages[language][text] !== undefined) {
          return returnText(languages[language][text]);
        }
      }

      const languageKeys = languagePriorities.map((lang) => lang.split("_")[0]);

      // Search for languages with the same keys
      for (const language in languages) {
        if (languageKeys.includes(language.split("_")[0])) {
          if (languages[language][text] !== undefined) {
            return returnText(languages[language][text]);
          }
        }
      }

      // If no priority language is found, return the first translation found
      for (const language in languages) {
        if (languages[language][text] !== undefined) {
          return returnText(languages[language][text]);
        }
      }

      // If no translation is found, return the original text
      return returnText(text);
    }
  }

  /**
   * Gets the content type of the content pack.
   * @returns The content type.
   * @throws {Error} If the content type is unknown.
   */
  getType(): ContentFilter {
    for (const filter of ContentPack.filters) {
      if (filter.filter(this) === true) {
        return filter;
      }
    }
    throw new Error("Unknown content type");
  }

  /**
   * Creates an array of ContentPack instances from a buffer containing a pack file.
   *
   * @param buffer - The buffer containing the pack file.
   * @returns A promise that resolves to an array of ContentPack instances.
   */
  static arrayFromPackFileBuffer(
    buffer: Buffer | Folder
  ): (ContentPack | WorldPack)[] {
    if (!(buffer instanceof Folder)) {
      // Recursively explore the zip file, looking inside folders to see if they are valid content packs
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries();

      var folder = new Folder(entries, "");
    } else {
      var folder = buffer;
    }

    const manifest = folder.getEntry("manifest.json");

    if (manifest) {
      return [new ContentPack(folder)];
    }

    const levelDat = folder.getEntry("level.dat");

    if (levelDat) {
      return [new WorldPack(folder)];
    }

    const folders: Record<string, AdmZip.IZipEntry[]> = {};

    const contentPacksFromZipFiles: (ContentPack | WorldPack)[] = [];

    for (const entry of folder.getEntries()) {
      const folderPathToReplace = (
        folder.folderPath !== "" ? `${folder.folderPath}/` : ""
      ).replace("//", "/");
      const entryName = entry.entryName.replace(folderPathToReplace, "");
      if (
        entryName.endsWith("/manifest.json") ||
        entryName.endsWith("/level.dat")
      ) {
        const paths = entryName.split("/");
        const folder = paths[0];
        if (!folders[folder]) {
          folders[folder] = [];
        }
        folders[folder].push(entry);
      } else {
        if (
          entry.entryName.endsWith(".mcpack") ||
          entry.entryName.endsWith(".mcworld")
        ) {
          const data = entry.getData();
          const contentPacks = ContentPack.arrayFromPackFileBuffer(data);
          contentPacksFromZipFiles.push(...contentPacks);
        }
      }
    }

    for (const folderName in folders) {
      const entries = folders[folderName];
      const newfolder = new Folder(entries, folder.getAbsolutePath(folderName));
      contentPacksFromZipFiles.push(
        ...ContentPack.arrayFromPackFileBuffer(newfolder)
      );
    }

    return [...contentPacksFromZipFiles];
  }

  static fromPackFileBuffer(buffer: Buffer | Folder): ContentBundle {
    const arr = ContentPack.arrayFromPackFileBuffer(buffer);
    const contentPacks = arr.filter(
      (content) => content instanceof ContentPack
    );
    const worldPacks = arr.filter((content) => content instanceof WorldPack);
    return {
      contentPacks: contentPacks,
      worldPacks: worldPacks,
    };
  }

  /**
   * Creates a new ContentPack instance from a file.
   * @param filePath - The path to the file.
   * @returns A Promise that resolves to a ContentPack instance.
   * @throws An error if the file does not exist.
   */
  static async fromFile(filePath: string) {
    const file = await Bun.file(filePath);
    if ((await file.exists()) === false)
      throw new Error(`File ${filePath} does not exist`);
    const buffer = Buffer.from(await file.arrayBuffer());
    return ContentPack.arrayFromPackFileBuffer(buffer);
  }
}

export { ContentPack, Folder };
export type { ContentBundle };
