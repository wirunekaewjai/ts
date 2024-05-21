import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { styleText } from "node:util";
import { getEscapeQuot } from "../macros/escape-quot";
import { OutputType } from "../types";

export async function generateTypescriptMacros(parent: string) {
  const outDir = "tiny_tsx";
  const outPath = path.join(parent, outDir, "macros.ts");
  const output = [
    getEscapeQuot(OutputType.TS_JSX),
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