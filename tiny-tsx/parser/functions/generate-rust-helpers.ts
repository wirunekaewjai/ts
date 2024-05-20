import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { getEscape } from "../helpers/escape";
import { OutputType } from "../types";

export async function generateRustHelpers(parent: string) {
  const outPath = path.join(parent, "helper.rs");
  const output = [
    getEscape(OutputType.RS_MACRO),
  ];

  const exists = existsSync(outPath);
  await writeFile(outPath, output.join("\n\n"), "utf8");

  if (exists) {
    console.log("*", outPath);
  } else {
    console.log(styleText("green", `+ ${outPath}`));
  }
}