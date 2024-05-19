import { existsSync } from "node:fs";
import { lstat, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";

export async function generateRustModules(parent: string, startAt: number) {
  const files = await readdir(parent);

  const pubs: string[] = [];
  const mods: string[] = [];
  const uses: string[] = [];

  for (const file of files) {
    const filePath = path.join(parent, file);
    const name = path.parse(filePath).name;

    if ((await lstat(filePath)).isDirectory()) {
      await generateRustModules(filePath, startAt);
      const stats = await lstat(path.join(filePath, "mod.rs"));

      if (stats.mtimeMs < startAt) {
        continue;
      }

      pubs.push(`pub mod ${name};`);
    }

    else {
      const stats = await lstat(filePath);

      if (stats.mtimeMs < startAt) {
        continue;
      }

      mods.push(`mod ${name};`);
      uses.push(`pub use ${name}::*;`);
    }
  }

  const a = pubs.sort().join("\n");
  const b = mods.sort().join("\n");
  const c = uses.sort().join("\n");

  if (!(a + b + c)) {
    return;
  }

  const lines: string[] = [];

  if (a) {
    lines.push(a);
  }

  if (b) {
    lines.push(b);
  }

  if (c) {
    lines.push(c);
  }

  const outPath = path.join(parent, "mod.rs");
  const output = lines.join("\n\n") + "\n";
  // const fmt = await $`echo "${modCode}" | rustfmt`.text();

  const exists = existsSync(outPath);
  await writeFile(outPath, output, "utf8");

  if (exists) {
    console.log("*", outPath);
  } else {
    console.log(styleText("green", `+ ${outPath}`));
  }
}
