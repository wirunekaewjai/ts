import { serializeJsonObject } from "./serialize-json";

export function stringifyTypescriptJson(input: string) {
  return serializeJsonObject(input, 0).output.replace(/"/g, "&quot;");

  // const pairs: string[] = [];

  // console.log("---");
  // console.log(input);
  // console.log("---");
  // input.replace(/\[[^\]]+\]/g, (substr) => {
  //   substr.slice(1, -1).trim().replace(/[^,]+/g, (substr2) => {
  //     console.log(substr2.trim());
  //     return "";
  //   });

  //   return "";
  // });

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
  //       pairs.push(`${key}:\${${value}}`);
  //     } else {
  //       pairs.push(`${key}:${arr[1].replace(/"/g, "&quot;")}`);
  //     }

  //     return "";
  //   });

  // return `{${pairs.join(",")}}`;
}