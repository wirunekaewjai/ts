import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";

export async function generateRustMacros(parent: string, macros: string[]) {
  const outDir = "tiny_tsx_macros";
  const names = [...macros].sort();

  for (const name of names) {
    const inPath = path.join(__dirname, `macros/${name}.rs`);
    const input = await Bun.file(inPath).text();

    const outPath = path.join(parent, outDir, `${name}.rs`);

    await mkdir(path.join(parent, outDir), {
      recursive: true,
    });

    const exists = existsSync(outPath);
    await writeFile(outPath, input, "utf8");

    if (exists) {
      console.log("*", outPath);
    } else {
      console.log(styleText("green", `+ ${outPath}`));
    }
  }
}