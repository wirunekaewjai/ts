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

  const fnLines: string[] = [];

  if (type === OutputType.RS_MACRO && template.content.includes("html!")) {
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
      `    return ${template.content}`,
      `}`,
    );
  }

  else {
    fnLines.push(
      `export const ${fnName} = (${fnArgs}) => ${template.content}`,
    );
  }

  if (template.footer) {
    fnLines.push("");
    fnLines.push(template.footer);
  }

  return fnLines.join("\n").trim() + "\n";
}