import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";

export async function generateTypescriptMacros(parent: string, macros: string[]) {
  const outDir = "tiny_tsx_macros";
  const names = [...macros].sort();

  for (const name of names) {
    const inPath = path.join(__dirname, `macros/${name}.ts`);
    const input = await Bun.file(inPath).text();

    const outPath = path.join(parent, outDir, `${name}.ts`);

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