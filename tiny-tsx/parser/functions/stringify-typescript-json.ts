import { serializeJsonArray, serializeJsonObject } from "./serialize-json";

export function stringifyTypescriptJson(input: string, isArray: boolean) {
  const map: Map<string, string> = new Map();
  const hash = Bun.hash.wyhash(Date.now().toString(16)).toString(16);

  const input1 = input.replace(/`([\s\S]*?)`/g, (substr) => {
    const key = `var_${hash}_${map.size}`;
    const value = substr;

    map.set(key, value);
    return key;
  });

  const obj = (isArray ? serializeJsonArray : serializeJsonObject)(input1, 0, (value) => {
    const m = map.get(value);

    if (m) {
      return `"\${${m}}"`;
    }

    return `\${${value}}`;
  });

  const out = obj.output;
  return `\${escape_quot(\`${out}\`)}`;
}