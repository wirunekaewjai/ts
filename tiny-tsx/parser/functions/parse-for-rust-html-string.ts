import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./cleanup";
import { formatFunctionName } from "./format-function-name";
import { glob } from "./glob";
import { collectArgs, collectInterfaces, generateModules, generateStructs, parseTemplateLiteral } from "./parse-for-rust-html-macro";
import { cleanupTemp, parseJsxToHtmlString, prepareTemp } from "./parse-jsx-to-html-string";
import { toLowerSnakeCase } from "./to-lower-snake-case";

async function parseRsFunction(fileName: string, input: string, namespace: string) {
  const { interfaces, output } = collectInterfaces(fileName, input);

  const arr = output.split("=>");
  const args = collectArgs(arr[0], interfaces.map);

  const fnName = toLowerSnakeCase(formatFunctionName(namespace, fileName));
  const fnArgs = args.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
  const fnContentRaw = arr[1].trim();

  let fnContent = await parseJsxToHtmlString(fileName, input);
  let hasJson = false;

  const fmtArgs: string[] = [];
  const fnUses: string[] = [];

  fnContent = fnContent
    .replace(/\${[^}]+}/g, (substr) => {
      if (substr.startsWith("${{")) {
        hasJson = true;

        const text = substr
          .slice(3, -1)
          .trim()
          .replace(/[^\s]+:/g, (key) => {
            return `"${key.slice(0, -1)}":`;
          });

        fmtArgs.push(`json!({${text}}).to_string()`);
        return "{";
      }

      fmtArgs.push(substr.slice(2, -1));
      return "{}";
    });

  if (hasJson) {
    fnUses.push("use serde_json::json;");
  }

  const fnStructs = generateStructs(interfaces.fields).trim();
  const fnExportContent: string[] = [];

  if (fmtArgs.length > 0) {
    fnExportContent.push(`    return format!(r#"${fnContent}"#, ${fmtArgs.join(", ")});`);
  } else {
    fnExportContent.push(`    return "${fnContent}".into();`);
  }

  const fnExport = [
    `pub fn ${fnName}(${fnArgs}) -> String {`,
    fnExportContent.join("\n"),
    `}`,
  ].join("\n");

  if (fnUses.length > 0) {
    fnUses.push("");
  }

  const lines: string[] = [
    ...fnUses,
    fnStructs,
    "",
    fnExport,
    "",
    "/*",
    fnContentRaw,
    "*/",
  ];

  const code = lines.join("\n").trim() + "\n";

  // if (fmtArgs.length > 0) {
  //   return await $`echo "${code}" | rustfmt`.text();
  // }

  return code;
}

export async function parseForRustHtmlString(srcDir: string, outDir: string, namespace: string) {
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
      const code = await parseRsFunction(srcPathObj.name, data, namespace);

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

  await $`rustfmt ${path.join(outDir, "**/*.rs")}`;

  await cleanup(outDir, startAt);
  await cleanupTemp();
}