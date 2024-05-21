import { serializeJsonArray, serializeJsonObject } from "./serialize-json";

export function stringifyTypescriptJson(input: string, isArray: boolean) {
  const obj = (isArray ? serializeJsonArray : serializeJsonObject)(input, 0, (value) => {
    return `\${formatJson(${value})}`;
  });

  const out = obj.output;
  return `\${formatJson(\`${out}\`)}`;

  // // Todo: replace with macros
  // return obj.output.replace(/"/g, "&quot;");
}