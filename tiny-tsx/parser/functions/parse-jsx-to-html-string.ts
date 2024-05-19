import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectArgs, collectInterfaces, generateInterfaces } from "./parse-for-typescript-jsx";
import { toLowerSnakeCase } from "./to-lower-snake-case";

const TEMP_DIR = ".tiny-tsx-temp";

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

export async function parseJsxToHtmlString(fileName: string, input: string) {
  const { interfaces, output } = collectInterfaces(fileName, input);

  const arr = output.split("=>");
  const args = collectArgs(arr[0], interfaces.map);

  const fnInterfaces = generateInterfaces(interfaces.fields);
  const fnName = toLowerSnakeCase(fileName);
  const fnArgs = args.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
  const fnContent = arr[1].trim();

  const stack: Array<[string, string]> = [];
  const hash = Bun.hash.wyhash("placeholder").toString(16);

  let incremental = 0;

  const fnContentPre = fnContent
    .replace(/json\!\({[^}]+}\)/g, (substr) => {
      const value = substr;
      const key = `${hash}_${++incremental}`;
      stack.push([key, value]);

      return key;
    })
    .replace(/({`[^`]+`})|({[^}]+})/g, (substr) => {
      const value = "${" + substr.slice(1, -1) + "}";
      const key = `${hash}_${++incremental}`;
      stack.push([key, value]);

      return "{\"" + key + "\"}";
    });

  const fnExportPre = `export const ${fnName} = (${fnArgs}) => ${fnContentPre}`;
  const fnOutputPre = `${fnInterfaces}\n${fnExportPre}`;

  const tempDir = ".tiny-tsx-temp";
  const tempName = Date.now().toString(16) + ".tsx";
  const tempPath = path.join(tempDir, tempName);

  await writeFile(tempPath, fnOutputPre, "utf8");

  const build = await Bun.build({
    entrypoints: [
      tempPath,
    ],
    outdir: tempDir,
    minify: {
      whitespace: true,
    },
  });

  let fnContentPost = "";

  if (build.outputs.length > 0) {
    const relativePath = path.relative(__dirname, build.outputs[0].path);

    fnContentPost = getContent(relativePath, fnName, 10);
    while (stack.length > 0) {
      const entry = stack.pop();

      if (!entry) {
        continue;
      }

      const [key, value] = entry;

      fnContentPost = fnContentPost.replace(key, value);
    }
  }

  fnContentPost = fnContentPost.replace(/(\${`[^`]+`})|(\${"[^"]+"})/g, (substr) => {
    if (substr.includes("json!")) {
      return substr;
    }

    return substr.slice(3, -2);
  });

  return fnContentPost;
}
