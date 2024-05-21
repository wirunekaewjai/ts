import { OutputType } from "../types";
import { collectFunctionArgs } from "./collect-function-args";
import { collectFunctionInterfaces } from "./collect-function-interfaces";
import { formatFunctionName } from "./format-function-name";
import { generatePropsTypes } from "./generate-props-types";
import { toLowerSnakeCase } from "./to-lower-snake-case";

export function buildFunction(
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

  if ((type === OutputType.RS_MACRO || type === OutputType.RS_STRING) && template.content.includes("format_json!")) {
    fnImports.push("use crate::format_json;");
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