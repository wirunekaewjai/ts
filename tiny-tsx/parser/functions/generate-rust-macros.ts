import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { getFormatJsonMacro } from "../macros/format-json";
import { OutputType } from "../types";

export async function generateRustMacros(parent: string) {
  const outDir = "tiny_tsx";
  const outPath = path.join(parent, outDir, "macros.rs");
  const output = [
    getFormatJsonMacro(OutputType.RS_MACRO),
  ];

  await mkdir(path.join(parent, outDir), {
    recursive: true,
  });

  const exists = existsSync(outPath);
  await writeFile(outPath, output.join("\n\n"), "utf8");

  if (exists) {
    console.log("*", outPath);
  } else {
    console.log(styleText("green", `+ ${outPath}`));
  }
}