import { OutputType } from "../types";
import { collectFunctionArgs } from "./collect-function-args";
import { collectFunctionInterfaces } from "./collect-function-interfaces";
import { formatFunctionName } from "./format-function-name";
import { generatePropsTypes } from "./generate-props-types";
import { toLowerSnakeCase } from "./to-lower-snake-case";

export function parseTemplate(
  namespace: string,
  name: string,
  type: OutputType,
  input: string,
  content: string,
  footer: string,
) {
  const header = input.split("=>")[0]?.trim();

  if (!header) {
    return null;
  }

  const fnInterfaces = collectFunctionInterfaces(name, type, header);
  const fnName = toLowerSnakeCase(formatFunctionName(namespace, name));
  const fnArgs = collectFunctionArgs(type, fnInterfaces.output, fnInterfaces.map);
  const fnPropsTypes = generatePropsTypes(type, fnInterfaces.fields);

  const fnLines: string[] = [];

  if (type === OutputType.RS_MACRO) {
    fnLines.push("use html_to_string_macro::html;");
    fnLines.push("");
  }

  if (fnPropsTypes) {
    fnLines.push(fnPropsTypes);
    fnLines.push("");
  }

  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    fnLines.push(
      `pub fn ${fnName}(${fnArgs}) -> String {`,
      `    return ${content}`,
      `}`,
    );
  }

  else {
    fnLines.push(
      `export const ${fnName} = (${fnArgs}) => ${content}`,
    );
  }

  if (footer) {
    fnLines.push("");
    fnLines.push(footer);
  }

  return fnLines.join("\n").trim() + "\n";
}