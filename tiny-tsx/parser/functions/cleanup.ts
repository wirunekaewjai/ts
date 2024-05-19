import { lstat, readdir, rm } from "node:fs/promises";
import { posix } from "node:path";
import { styleText } from "node:util";

export async function cleanup(parent: string, startAt: number) {
  const files = await readdir(parent);

  for (const file of files) {
    const path = posix.join(parent, file);

    if ((await lstat(path)).isDirectory()) {
      await cleanup(path, startAt);
    }

    else {
      const { mtimeMs } = await lstat(path);

      if (mtimeMs > startAt) {
        continue;
      }

      await rm(path, {
        force: true,
        recursive: true,
      });

      console.log(styleText("yellow", `- ${path}`));
    }
  }

  const current = await readdir(parent);

  if (current.length > 0) {
    return;
  }

  await rm(parent, {
    force: true,
    recursive: true,
  });

  console.log(styleText("yellow", `- ${parent}`));
}