import { $ } from "bun";
import { existsSync } from "node:fs";
import { lstat, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { cleanup } from "./cleanup";
import { formatFunctionName } from "./format-function-name";
import { glob } from "./glob";
import { toLowerSnakeCase } from "./to-lower-snake-case";
import { toPascalCase } from "./to-pascal-case";

export function parseTypeForStruct(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "String";

    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
      return input;

    default:
      throw `invalid type: ${input}`;
  }
}

export function parseTypeForInline(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "&str";

    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
      return input;

    default:
      throw `invalid type: ${input}`;
  }
}

export function collectInterfaces(fileName: string, input: string) {
  const pattern = /interface\s[^{]+{[^}]+}/g;
  const name = toPascalCase(fileName);

  // console.log("#", fileName, "->", name);

  const interfaceMap: Map<string, string> = new Map();
  const interfaceFields: Map<string, string[][]> = new Map();

  const output = input.replace(pattern, (substr) => {
    substr = substr.replace(/\s+/g, " ");

    const arr = substr.split(" ");
    const interfaceName = name + arr[1];

    interfaceMap.set(arr[1], interfaceName);

    // console.log(interfaceName);

    const fields: string[][] = [];

    for (let i = 3; i < arr.length - 1; i += 2) {
      const fieldName = arr[i].slice(0, -1).trim();
      let fieldType = arr[i + 1].slice(0, -1).trim();

      if (interfaceMap.get(fieldType)) {
        fieldType = interfaceMap.get(fieldType)!;
      } else {
        fieldType = parseTypeForStruct(fieldType);
      }

      fields.push([fieldName, fieldType]);

      // console.log(fieldName, fieldType);
    }

    interfaceFields.set(interfaceName, fields);
    return "";
  });

  return {
    interfaces: {
      fields: interfaceFields,
      map: interfaceMap,
    },

    output: output.trim(),
  };
}

export function collectArgs(input: string, map: Map<string, string>) {
  const arr = input.trim().slice(1, -1).split(",").filter((e) => !!e);
  const fields: string[][] = [];

  for (const text of arr) {
    const parts = text.split(":");
    const name = parts[0].trim();

    let type = parts[1].trim();

    if (map.get(type)) {
      type = map.get(type)!;
    } else {
      type = parseTypeForInline(type);
    }

    fields.push([name, type]);
  }

  return fields;
}

export function generateStructs(interfaces: Map<string, string[][]>) {
  const items: string[] = [];

  interfaces.forEach((fields, interfaceName) => {
    items.push(`pub struct ${interfaceName} {`);

    fields.forEach(([fieldName, fieldType]) => {
      items.push(`    ${fieldName}: ${fieldType},`);
    });

    items.push("}");
    items.push("");
  });

  return items.join("\n");
}

export function parseTemplateLiteral(input: string) {
  const args: string[] = [];

  input = input.replace(/\${[^}]+}/g, (substr) => {
    substr = substr.slice(2, -1);
    args.push(substr);
    return "{}";
  });

  return `format!("${input}", ${args.join(", ")})`;
}

function parseRsxFunction(fileName: string, input: string, namespace: string) {
  const { interfaces, output } = collectInterfaces(fileName, input);

  const arr = output.split("=>");
  const args = collectArgs(arr[0], interfaces.map);

  const fnUses: string[] = [
    "use html_to_string_macro::html;",
  ];

  let hasJson = false;

  const fnName = toLowerSnakeCase(formatFunctionName(namespace, fileName));
  const fnArgs = args.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
  const fnContent = arr[1]
    .trim()
    .replace(/{\`.+/g, (substr) => {
      const lastIndex = substr.lastIndexOf("`}");

      if (lastIndex < 0) {
        return substr;
      }

      const template = substr.slice(2, lastIndex);
      const other = substr.slice(lastIndex + 2);

      // console.log("template:", parseTemplateLiteral(template));

      return `{${parseTemplateLiteral(template)}}` + other;
    })
    .replace(/{{[^}]+}}/g, (substr) => {
      hasJson = true;

      const text = substr
        .slice(2, -2)
        .trim()
        .replace(/[^\s]+:/g, (key) => {
          return `"${key.slice(0, -1)}":`;
        });

      return `{json!({${text}}).to_string()}`;
    })
    .split(/\r?\n/g)
    .map((line, index) => {
      if (index === 0) {
        return line;
      }

      if (line.trim() === "") {
        return "";
      }

      return "    " + line;

      // const trimmed = line.trimStart();
      // const diff = line.length - trimmed.length;
      // const indent = (diff * 2) + 4;
      // const space = "".padEnd(indent, " ");

      // return space + trimmed;
    })
    .join("\n");

  if (hasJson) {
    fnUses.push("use serde_json::json;");
  }

  const fnStructs = generateStructs(interfaces.fields).trim();
  const fnExport = [
    `pub fn ${fnName}(${fnArgs}) -> String {`,
    `    return html!${fnContent}`,
    `}`,
  ].join("\n");

  const lines: string[] = [
    ...fnUses,
  ];

  if (fnStructs) {
    lines.push("");
    lines.push(fnStructs);
  }

  lines.push("");
  lines.push(fnExport);

  return lines.join("\n").trim() + "\n";
}

export async function generateModules(parent: string, startAt: number) {
  const files = await readdir(parent);

  const pubs: string[] = [];
  const mods: string[] = [];
  const uses: string[] = [];

  for (const file of files) {
    const filePath = path.join(parent, file);
    const name = path.parse(filePath).name;

    if ((await lstat(filePath)).isDirectory()) {
      await generateModules(filePath, startAt);
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

export async function parseForRustHtmlMacro(srcDir: string, outDir: string, namespace: string) {
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
      const code = parseRsxFunction(srcPathObj.name, data, namespace);
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
    } catch {
      console.log(styleText("red", `! ${outPath}`));
    }
  }

  await generateModules(outDir, startAt);

  await $`rustfmt ${path.join(outDir, "**/*.rs")}`;

  await cleanup(outDir, startAt);
}