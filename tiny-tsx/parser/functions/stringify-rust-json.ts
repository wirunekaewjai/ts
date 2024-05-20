import { serializeJsonObject } from "./serialize-json";

export function stringifyRustJson(input: string) {
  const args: string[] = [];
  const obj = serializeJsonObject(input, 0, (value) => {
    args.push(value);
    return "{}";
  });

  if (args.length > 0) {
    return `escape!(format!("{${obj.output.replace(/"/g, '\\"')}}", ${args.join(", ")}))`;
  }

  return `escape!("` + obj.output.replace(/"/g, '\\"') + `")`;

  // const pairs: string[] = [];
  // const args: string[] = [];

  // input
  //   .trim()
  //   .replace(/[^,]+/g, (substr) => {
  //     const arr = substr.trim().split(":").map((x) => x.trim());
  //     const key = getKey(arr[0]);

  //     if (!key) {
  //       return "";
  //     }

  //     if (isVar(arr[1])) {
  //       const value = arr[1] ?? arr[0];

  //       args.push(value);
  //       pairs.push(`${key}:{}`);
  //     } else {
  //       pairs.push(`${key}:${arr[1].replace(/"/g, "&quot;")}`);
  //     }

  //     return "";
  //   });

  // const text = pairs.join(",");

  // if (args.length > 0) {
  //   return `format!("{{${text}}}", ${args.join(", ")})`;
  // }

  // return `"{` + text + `}"`;
}