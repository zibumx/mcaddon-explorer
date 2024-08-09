import { ContentPack, Folder } from "@/ContentPack/ContentPack";
import * as nbt from "prismarine-nbt";
import { z } from "zod";

class nbtUtils {
  static hasGzipHeader = function (data: Buffer) {
    let result = true;
    if (data[0] !== 0x1f) result = false;
    if (data[1] !== 0x8b) result = false;
    return result;
  };

  static hasBedrockLevelHeader = (data: Buffer) =>
    data[1] === 0 && data[2] === 0 && data[3] === 0;

  static parseWorldNbt(data: Buffer) {
    if (nbtUtils.hasGzipHeader(data)) {
      throw new Error("NBT data is gzipped");
    }

    if (!nbtUtils.hasBedrockLevelHeader(data)) {
      throw new Error("NBT data is not a bedrock level data");
    }

    (data as any).startOffset = 8;
    const parsed = nbt.parseUncompressed(data, "little");
    return nbt.simplify(parsed);
  }
}

const worldDataValidator = z.object({
  LevelName: z.string(),
  GameType: z.number(),
  MinimumCompatibleClientVersion: z.array(z.number()),
});

const activeContentPackValidator = z.array(
  z.object({
    pack_id: z.string(),
    version: z.array(z.number().int()).length(3),
  })
);

class WorldPack {
  folder: Folder;
  worldData: z.infer<typeof worldDataValidator>;

  behaviorPacks: ContentPack[] = [];
  resourcePacks: ContentPack[] = [];

  activeBehaviorPacks: ContentPack[] = [];
  activeResourcePacks: ContentPack[] = [];

  missingPacks: boolean = false;

  constructor(entries: Folder) {
    this.folder = entries;

    const levelFile = entries.find((entry) => {
      return entry.entryName === "level.dat";
    });

    if (!levelFile) {
      throw new Error("Invalid world pack");
    }

    const data = levelFile.getData();
    const nbtData = nbtUtils.parseWorldNbt(data);

    const worldData = worldDataValidator.parse(nbtData);

    this.worldData = worldData;

    for (const type of ["resource_packs", "behavior_packs"]) {
      const packEntries = entries.filterEntries((entry) => {
        return entry.entryName.startsWith(`${type}/`);
      });

      if (packEntries.length === 0) {
        continue;
      }

      const packsFolder = new Folder(packEntries, `${type}/`);
      const packs = ContentPack.fromPackFileBuffer(packsFolder);

      if (type === "resource_packs") {
        this.resourcePacks = packs.contentPacks;
      } else {
        this.behaviorPacks = packs.contentPacks;
      }

      const activeContentPacks = entries.getEntry(`world_${type}.json`);
      if (activeContentPacks) {
        const activeContentPacksData = activeContentPacks.getData();
        const activeContentPacksJson = JSON.parse(
          activeContentPacksData.toString()
        );
        const validatedContent = activeContentPackValidator.safeParse(
          activeContentPacksJson
        );
        if (validatedContent.success) {
          for (const packData of validatedContent.data) {
            const pack = packs.contentPacks.find((pack) => {
              return pack.manifest.header.uuid === packData.pack_id;
            });
            if (pack) {
              // If the pack is found, add it
              if (type === "resource_packs") {
                this.activeResourcePacks.push(pack);
              } else {
                this.activeBehaviorPacks.push(pack);
              }
            } else {
              // If not, add an error
              this.missingPacks = true;
            }
          }
        }
      }
    }
  }
}

export { WorldPack };
