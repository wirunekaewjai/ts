import { OutputType } from "../types";
import { parseContent } from "./parse-content";
import { parseTemplate } from "./parse-template";

export async function parse(
  namespace: string,
  name: string,
  type: OutputType,
  input: string,
) {
  const isString = type === OutputType.RS_STRING || type === OutputType.TS_STRING;

  const content = await parseContent(type, input);
  const footer = isString ? `/*\n${content.original}\n*/` : "";
  const template = parseTemplate(namespace, name, type, input, content.output, footer);

  return template;
}