import { OutputType } from "../types";
import { buildFunction } from "./build-function";
import { buildRustContent } from "./build-rust-content";
import { buildTypescriptContent } from "./build-typescript-content";
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

  let content = await buildTypescriptContent(template.content);

  if (!content) {
    return null;
  }

  if (type === OutputType.RS_HTML) {
    content = await buildRustContent(content);
    content = content.replaceAll("json!(", "json_esc!(");
  } else {
    content = content.replaceAll("json!(", "json_esc(");
  }

  const footer = `/*\n${template.content}\n*/`;

  return buildFunction(outDir, outPath, namespace, name, type, {
    interfaces: template.interfaces,
    args: template.args,
    content,
    footer,
  });
}