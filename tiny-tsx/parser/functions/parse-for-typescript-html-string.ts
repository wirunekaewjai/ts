import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./cleanup";
import { formatFunctionName } from "./format-function-name";
import { glob } from "./glob";
import { collectArgs, collectInterfaces, generateInterfaces } from "./parse-for-typescript-jsx";
import { cleanupTemp, parseJsxToHtmlString, prepareTemp } from "./parse-jsx-to-html-string";
import { toLowerSnakeCase } from "./to-lower-snake-case";

export async function parseJsFunction(fileName: string, input: string, namespace: string) {
  const { interfaces, output } = collectInterfaces(fileName, input);

  const arr = output.split("=>");
  const args = collectArgs(arr[0], interfaces.map);

  const fnInterfaces = generateInterfaces(interfaces.fields);
  const fnName = toLowerSnakeCase(formatFunctionName(namespace, fileName));
  const fnArgs = args.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
  const fnContentRaw = arr[1].trim();

  const fnContentHtml = await parseJsxToHtmlString(fileName, input);
  const fnExport = `export const ${fnName} = (${fnArgs}) => \`${fnContentHtml}\`;`;
  const fnOutput = `${fnInterfaces}\n${fnExport}\n\n/*\n${fnContentRaw}\n*/`;

  return fnOutput.trim();
}

export async function parseForTypescriptHtmlString(srcDir: string, outDir: string, namespace: string) {
  await prepareTemp();

  const startAt = Date.now();
  const srcFilePaths = glob(srcDir, ".tsx");

  for (const srcFilePath of srcFilePaths) {
    const srcPathObj = path.parse(srcFilePath);

    const srcParentPath = srcPathObj.dir;
    const srcFileName = srcPathObj.name + ".ts";

    const outPath = path.join(outDir, srcParentPath, srcFileName);
    const outParentPath = path.dirname(outPath);

    try {
      const data = await Bun.file(path.join(srcDir, srcFilePath)).text();
      const code = await parseJsFunction(srcPathObj.name, data, namespace);

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
    } catch (er) {
      console.log(er);
      console.log(styleText("red", `! ${outPath}`));
    }
  }

  await cleanup(outDir, startAt);
  await cleanupTemp();
}