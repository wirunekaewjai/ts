import { extractTemplateBody } from "./extract-template-body";
import { extractTemplateInterfaces } from "./extract-template-interfaces";

export function extractTemplate(input: string) {
  const interfaces = extractTemplateInterfaces(input);
  const body = extractTemplateBody(input);

  return {
    interfaces,
    args: body?.args ?? [],
    content: body?.content ?? "",
  };
}