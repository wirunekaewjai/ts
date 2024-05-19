import { existsSync } from "node:fs";
import { lstat, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./cleanup";
import { glob } from "./glob";
import { toLowerSnakeCase } from "./to-lower-snake-case";
import { collectArgs, collectInterfaces, generateModules, generateStructs, parseTemplateLiteral } from "./parse-for-rust-html-macro";
import { cleanupTemp, parseJsxToHtmlString, prepareTemp } from "./parse-jsx-to-html-string";

async function parseRsFunction(fileName: string, input: string) {
  const { interfaces, output } = collectInterfaces(fileName, input);

  const arr = output.split("=>");
  const args = collectArgs(arr[0], interfaces.map);

  const fnName = toLowerSnakeCase(fileName);
  const fnArgs = args.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
  const fnContentRaw = arr[1].trim();

  let fnContent = await parseJsxToHtmlString(fileName, input);

  const fmtLines: string[] = [];
  const fmtArgs: string[] = [];

  fnContent = fnContent.replace(/\${[^}]+}/g, (substr) => {
    const key = `v_${fmtArgs.length}`;

    fmtLines.push(`    let ${key} = ${substr.slice(2, -1)};`);
    fmtArgs.push(key);

    return "{}";
  });

  if (fmtLines.length > 0) {
    fmtLines.push("");
  }

  const fnUses = `use html_to_string_macro::html;`;
  const fnStructs = generateStructs(interfaces.fields).trim();
  const fnExport = [
    `pub fn ${fnName}(${fnArgs}) -> String {`,
    fmtLines.join("\n"),
    `    return format!(r#"${fnContent}"#, ${fmtArgs.join(", ")});`,
    `}`,
    "",
    "",
    `/*\n${fnContentRaw}\n*/`,
  ].join("\n");

  const lines: string[] = [
    fnUses,
  ];

  if (fnStructs) {
    lines.push("");
    lines.push(fnStructs);
  }

  lines.push("");
  lines.push(fnExport);

  return lines.join("\n").trim() + "\n";
}

export async function parseForRustHtmlString(srcDir: string, outDir: string) {
  await prepareTemp();

  const startAt = Date.now();
  const srcFilePaths = glob(srcDir, ".tsx");

  for (const srcFilePath of srcFilePaths) {
    const srcPathObj = path.parse(srcFilePath);

    const srcParentPath = srcPathObj.dir;
    const srcFileName = toLowerSnakeCase(srcPathObj.name) + ".rs";

    const outPath = path.join(outDir, srcParentPath, srcFileName);
    const outParentPath = path.dirname(outPath);

    try {
      const data = await Bun.file(path.join(srcDir, srcFilePath)).text();
      const code = await parseRsFunction(srcPathObj.name, data);
      // const fmt = await $`echo "${code}" | rustfmt`.text();

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
      console.log(err);
      console.log(styleText("red", `! ${outPath}`));
    }
  }

  await generateModules(outDir, startAt);
  await cleanup(outDir, startAt);
  await cleanupTemp();
}