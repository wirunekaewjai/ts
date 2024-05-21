import path from "node:path";
import { OutputType } from "../types";
import { collectFunctionArgs } from "./collect-function-args";
import { collectFunctionInterfaces } from "./collect-function-interfaces";
import { formatFunctionName } from "./format-function-name";
import { generatePropsTypes } from "./generate-props-types";
import { toLowerSnakeCase } from "./to-lower-snake-case";

export function buildFunction(
  outDir: string,
  outPath: string,
  namespace: string,
  name: string,
  type: OutputType,
  template: {
    interfaces: string[];
    args: string[];
    content: string;
    footer: string;
  },
) {
  const fnInterfaces = collectFunctionInterfaces(name, type, template.interfaces);
  const fnName = toLowerSnakeCase(formatFunctionName(namespace, name));
  const fnArgs = collectFunctionArgs(type, template.args, fnInterfaces.map);
  const fnPropsTypes = generatePropsTypes(type, fnInterfaces.fields);

  const fnImports: string[] = [];
  const fnHeaders: string[] = [];
  const fnBodies: string[] = [];

  // Imports
  if (type === OutputType.RS_MACRO && template.content.includes("html!")) {
    fnImports.push("use html_to_string_macro::html;");
  }

  if ((type === OutputType.RS_MACRO || type === OutputType.RS_STRING) && template.content.includes("escape_quot!")) {
    fnImports.push("use crate::escape_quot;");
  }

  if ((type === OutputType.TS_JSX || type === OutputType.TS_STRING) && template.content.includes("escape_quot(")) {
    const outParentPath = path.dirname(outPath);
    const macroPath = path.join(outDir, "tiny_tsx/macros");
    const relativePath = path.relative(outParentPath, macroPath);

    fnImports.push(`import { escape_quot } from "./${relativePath}";`);
  }

  // Interfaces / Struct
  if (fnPropsTypes) {
    fnHeaders.push(fnPropsTypes);
  }

  // Body
  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    fnBodies.push(
      `pub fn ${fnName}(${fnArgs}) -> String {`,
      `    return ${template.content}`,
      `}`,
    );
  }

  else {
    fnBodies.push(
      `export const ${fnName} = (${fnArgs}) => ${template.content}`,
    );
  }

  fnBodies.push("");

  if (template.footer) {
    fnBodies.push(template.footer);
    fnBodies.push("");
  }

  const a = fnImports.join("\n").trim();
  const b = fnHeaders.join("\n").trim();
  const c = fnBodies.join("\n").trim();

  const fnLines: string[] = [];

  if (a) {
    fnLines.push(a);
  }

  if (b) {
    fnLines.push(b);
  }

  if (c) {
    fnLines.push(c);
  }

  return fnLines.join("\n\n") + "\n";
}