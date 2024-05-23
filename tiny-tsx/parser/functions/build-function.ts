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

  const useMacros: string[] = [];

  // Imports
  if (type === OutputType.RS_HTML && template.content.includes("json_esc!")) {
    fnImports.push("use crate::json_esc;");
    useMacros.push("json_esc");
  }

  if (type === OutputType.TS_HTML && template.content.includes("json_esc(")) {
    const outParentPath = path.dirname(outPath);
    const macroPath = path.join(outDir, "tiny_tsx_macros/json_esc");
    const relativePath = path.relative(outParentPath, macroPath);

    fnImports.push(`import { json_esc } from "./${relativePath}";`);
    useMacros.push("json_esc");
  }

  // Interfaces / Struct
  if (fnPropsTypes) {
    fnHeaders.push(fnPropsTypes);
  }

  // Body
  if (type === OutputType.RS_HTML) {
    fnBodies.push(
      `pub fn ${fnName}(${fnArgs}) -> String {`,
      `    return ${template.content};`,
      `}`,
    );
  }

  else {
    fnBodies.push(
      `export const ${fnName} = (${fnArgs}) => \`${template.content}\`;`,
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

  return {
    macros: useMacros,
    output: fnLines.join("\n\n") + "\n",
  };
}