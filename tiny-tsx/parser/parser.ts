import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./functions/cleanup";
import { generateRustMacros } from "./functions/generate-rust-macros";
import { generateRustModules } from "./functions/generate-rust-modules";
import { generateTypescriptMacros } from "./functions/generate-typescript-macros";
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

      const isRust = outType === OutputType.RS_HTML;
      const isTs = !isRust;

      const macros: string[] = [];

      for (const srcFilePath of srcFilePaths) {
        const srcPathObj = path.parse(srcFilePath);

        const srcParentPath = srcPathObj.dir;
        const srcFileName = (isRust ? toLowerSnakeCase(srcPathObj.name) : srcPathObj.name) + outExt;

        const outPath = path.join(outDir, srcParentPath, srcFileName);
        const outParentPath = path.dirname(outPath);

        const exists = existsSync(outPath);

        try {
          const data = srcData[srcFilePath];
          const result = await parse(outDir, outPath, namespace, srcPathObj.name, outType, data);

          if (!result?.output) {
            if (exists) {
              await rm(outPath, {
                force: true,
                recursive: true,
              });

              console.log(styleText("yellow", `- ${outPath}`));
            } else {
              console.log(styleText("gray", `? ${outPath}`));
            }

            continue;
          }

          await mkdir(outParentPath, {
            recursive: true,
          });

          const output = "// AUTO GENERATED\n" + result.output;
          await writeFile(outPath, output, "utf8");

          if (exists) {
            console.log(`* ${outPath}`);
          } else {
            console.log(styleText("green", `+ ${outPath}`));
          }

          result.macros.forEach((macro) => {
            if (macros.includes(macro)) {
              return;
            }

            macros.push(macro);
          });
        } catch (err) {
          console.log(styleText("red", `! ${outPath}`));
          console.log(err);
          console.log();
        }
      }

      if (isTs) {
        await generateTypescriptMacros(outDir, macros);
      }

      if (isRust) {
        await generateRustMacros(outDir, macros);
        await generateRustModules(outDir, startAt);
      }

      if (outType === OutputType.RS_HTML) {
        await $`rustfmt ${path.join(outDir, "**/*.rs")}`.catch();
      }

      await cleanup(outDir, startAt);

      console.log();
    }

    await cleanupTemp();
  }
}