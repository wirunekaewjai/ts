import { OutputType } from "../types";
import { buildContent } from "./build-content";
import { buildFunction } from "./build-function";
import { extractTemplate } from "./extract-template";

export async function parse(
  outDir: string,
  outPath: string,
  namespace: string,
  name: string,
  type: OutputType,
  input: string,
) {
  const template = extractTemplate(input);

  if (!template.content) {
    // invalid file
    return null;
  }

  const isString = type === OutputType.RS_STRING || type === OutputType.TS_STRING;

  const content = await buildContent(type, template.content);
  const footer = isString ? `/*\n${template.content}\n*/` : "";

  return buildFunction(outDir, outPath, namespace, name, type, {
    interfaces: template.interfaces,
    args: template.args,
    content,
    footer,
  });
}