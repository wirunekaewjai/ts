import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const TEMP_DIR = ".tiny-tsx-temp";

export async function prepareTemp() {
  await mkdir(TEMP_DIR, {
    recursive: true,
  });
}

export async function cleanupTemp() {
  await rm(TEMP_DIR, {
    force: true,
    recursive: true,
  });
}

function getContent(relativePath: string, functionName: string, attempt: number) {
  if (attempt <= 0) {
    throw `failed to get content from ${relativePath}.${functionName}`;
  }

  try {
    const module = require(relativePath);
    return module[functionName]();
  } catch {
    Bun.sleepSync(10);
    return getContent(relativePath, functionName, attempt - 1);
  }
}

export async function jsxToString(functionName: string, input: string) {
  const tempName = Date.now().toString(16) + ".tsx";
  const tempPath = path.join(TEMP_DIR, tempName);

  await writeFile(tempPath, input, "utf8");

  const build = await Bun.build({
    entrypoints: [
      tempPath,
    ],
    outdir: TEMP_DIR,
    minify: {
      whitespace: true,
    },
  });

  if (build.outputs.length > 0) {
    const relativePath = path.relative(__dirname, build.outputs[0].path);
    return getContent(relativePath, functionName, 10);
  }

  return null;
}
