import { serializeJsonArray, serializeJsonObject } from "./serialize-json";
import { stringifyRustStringTemplate } from "./stringify-rust-string-template";

export function stringifyRustJson(input: string, isArray: boolean) {
  const map: Map<string, string> = new Map();
  const hash = Bun.hash.wyhash(Date.now().toString(16)).toString(16);

  const input1 = input.replace(/`([\s\S]*?)`/g, (substr) => {
    const key = `var_${hash}_${map.size}`;
    const value = stringifyRustStringTemplate(substr.slice(1, -1));

    map.set(key, value);
    return key;
  });

  const args: string[] = [];
  const obj = (isArray ? serializeJsonArray : serializeJsonObject)(input1, 0, (value) => {
    const m = map.get(value);

    if (m) {
      args.push(m);
      return `"{}"`;
      // args.push(`format!("{}", ${m})`);
    } else {
      args.push(value);
      return "{}";
      // args.push(`format!("{}", ${value})`);
    }

    // console.log(value);
  });

  const out = obj.output
    .replace(/\{[^}]/g, (substr) => "{" + substr)
    .replace(/[^{]\}/g, (substr) => substr + "}");

  if (args.length > 0) {
    return `escape_quot!(r#"${out}"#, ${args.join(", ")})`;
  }

  return `escape_quot!(r#"${out}"#)`;
}