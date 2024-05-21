import { serializeJsonArray, serializeJsonObject } from "./serialize-json";

export function stringifyRustJson(input: string, isArray: boolean) {
  const args: string[] = [];
  const obj = (isArray ? serializeJsonArray : serializeJsonObject)(input, 0, (value) => {
    args.push(`format_json!("{}", ${value})`);
    return "{}";
  });

  const out = obj.output
    .replace(/\{[^}]/g, (substr) => "{" + substr)
    .replace(/[^{]\}/g, (substr) => substr + "}");

  if (args.length > 0) {
    return `format_json!(r#"${out}"#, ${args.join(", ")})`;
  }

  return `format_json!(r#"${out}"#)`;
}