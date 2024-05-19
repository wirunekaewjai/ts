import path from "node:path";
import type { WatchItem } from "./types";

export type {
  WatchItem,
};

export async function sequentialWatch(items: WatchItem[]) {
  const glob = new Bun.Glob("**/*");
  const previousHashMaps: Array<Map<string, bigint>> = [];

  for (let i = 0; i < items.length; i++) {
    previousHashMaps.push(new Map());
  }

  while (true) {
    for (let i = 0; i < items.length; i++) {
      const previousHashMap = previousHashMaps[i];
      const { callback, dirs } = items[i];

      let isDirty = false;

      const currentFilePaths: string[] = [];

      await Promise.all(
        dirs.map(async (cwd) => {
          const iter = glob.scan({
            cwd,
            onlyFiles: true,
          });

          for await (const file of iter) {
            const filePath = path.join(cwd, file);
            const fileData = await Bun.file(filePath).arrayBuffer();
            const fileHash = Bun.hash.wyhash(fileData);

            const previousHash = previousHashMap.get(filePath);

            if (previousHash !== fileHash) {
              isDirty = true;
              previousHashMap.set(filePath, fileHash);
            }

            currentFilePaths.push(filePath);
          }
        })
      );

      const previousFilePaths = Array.from(previousHashMap.keys());

      for (const filePath of previousFilePaths) {
        if (currentFilePaths.includes(filePath)) {
          continue;
        }

        isDirty = true;
        previousHashMap.delete(filePath);
      }

      if (isDirty) {
        await callback();
      }
    }

    await Bun.sleep(1000);
  }
}
