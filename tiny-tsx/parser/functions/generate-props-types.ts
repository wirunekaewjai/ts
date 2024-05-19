import { OutputType } from "../types";

export function generatePropsTypes(type: OutputType, interfaces: Map<string, string[][]>) {
  const items: string[] = [];

  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    interfaces.forEach((fields, interfaceName) => {
      items.push(`pub struct ${interfaceName} {`);

      fields.forEach(([fieldName, fieldType]) => {
        items.push(`    ${fieldName}: ${fieldType},`);
      });

      items.push("}");
      items.push("");
    });
  }

  else {
    interfaces.forEach((fields, interfaceName) => {
      items.push(`export interface ${interfaceName} {`);

      fields.forEach(([fieldName, fieldType]) => {
        items.push(`  ${fieldName}: ${fieldType};`);
      });

      items.push("}");
      items.push("");
    });
  }

  return items.join("\n").trim();
}