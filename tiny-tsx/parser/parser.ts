import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./functions/cleanup";
import { generateRustModules } from "./functions/generate-rust-modules";
import { getExtension } from "./functions/get-extension";
import { glob } from "./functions/glob";
import { cleanupTemp, prepareTemp } from "./functions/jsx-to-string";
import { parse } from "./functions/parse";
import { toLowerSnakeCase } from "./functions/to-lower-snake-case";
import { OutputType, type Config } from "./types";

export class TinyTsxParser {
  public constructor(
    private readonly srcDir: string,
    private readonly configs: Config[],
  ) { }

  public async parse() {
    const srcDir = this.srcDir;

    const startAt = Date.now();
    const srcFilePaths = glob(srcDir, ".tsx");
    const srcData: Record<string, string> = {};

    for (const srcFilePath of srcFilePaths) {
      srcData[srcFilePath] = await Bun.file(path.join(srcDir, srcFilePath)).text();
    }

    await prepareTemp();

    for (const config of this.configs) {
      const outDir = config.dir;
      const outType = config.type;
      const outExt = getExtension(outType);
      const namespace = config.namespace ?? "";

      const isRust = outType === OutputType.RS_MACRO || outType === OutputType.RS_STRING;

      for (const srcFilePath of srcFilePaths) {
        const srcPathObj = path.parse(srcFilePath);

        const srcParentPath = srcPathObj.dir;
        const srcFileName = (isRust ? toLowerSnakeCase(srcPathObj.name) : srcPathObj.name) + outExt;

        const outPath = path.join(outDir, srcParentPath, srcFileName);
        const outParentPath = path.dirname(outPath);

        try {
          const data = srcData[srcFilePath];
          const code = await parse(namespace, srcPathObj.name, outType, data);

          await mkdir(outParentPath, {
            recursive: true,
          });

          const exists = existsSync(outPath);
          const output = "// AUTO GENERATED\n" + code;

          await writeFile(outPath, output, "utf8");

          if (exists) {
            console.log("*", outPath);
          } else {
            console.log(styleText("green", `+ ${outPath}`));
          }
        } catch (err) {
          console.log(styleText("red", `! ${outPath}`));
          console.log(err);
          console.log();
        }
      }

      if (isRust) {
        await generateRustModules(outDir, startAt);
      }

      if (outType === OutputType.RS_STRING) {
        await $`rustfmt ${path.join(outDir, "**/*.rs")}`;
      }

      await cleanup(outDir, startAt);
      console.log();
    }

    await cleanupTemp();
  }
}