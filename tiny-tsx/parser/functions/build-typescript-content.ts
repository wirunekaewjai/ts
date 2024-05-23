import { getRandomKeyString } from "./get-random-key-string";
import { jsxToString } from "./jsx-to-string";
import { serializeJsonArray, serializeJsonObject } from "./serialize-json";

export async function buildTypescriptContent(input: string) {
  const mapQuotes = new Map<string, string>();
  const mapJsonStringTemplateExpressions = new Map<string, string>();
  const mapJsonStringTemplates = new Map<string, string>();
  const mapJsons = new Map<string, string>();
  const mapStringTemplateExpressions = new Map<string, string>();
  const mapExpressions = new Map<string, string>();

  let code = input.trim().slice(1, -2).trim();

  code = code
    // remove empty {}
    .replace(/\{\s*\}/g, "")

    // map double quote, single quote to avoid conflicted with json macro, string template expression
    .replace(/(\$\{\"[\s\S]*?\"\})|(\=\{\"[\s\S]*?\"\})|(\{\"[\s\S]*?\"\})|(\$\{\'[\s\S]*?\'\})|(\=\{\'[\s\S]*?\'\})|(\{\'[\s\S]*?\'\})/g, (substr) => {
      const key = "v_" + getRandomKeyString(code);

      // expression value
      if (substr.startsWith("$")) {
        const value = substr.slice(3, -2);

        mapQuotes.set(key, value);
        return key;
      }

      // attributes
      if (substr.startsWith("=")) {
        const value = `="${substr.slice(3, -2)}"`;

        mapQuotes.set(key, value);
        return key;
      }

      // content
      mapQuotes.set(key, substr);
      return key;
    })

    // json({...}) or json([...])
    .replace(/(json\(\{[\s\S]*?\}\))|(json\(\[[\s\S]*?\]\))/g, (substr) => {
      const key = getRandomKeyString(code);
      const sub = substr.slice(5, -1)
        // string template expressions
        .replace(/\$\{[\s\S]*?\}/g, (substr) => {
          const key = getRandomKeyString(code);

          mapJsonStringTemplateExpressions.set(key, substr);
          return key;
        })

        // string template literal
        .replace(/\`[\s\S]*?\`/g, (substr) => {
          const key = getRandomKeyString(code);

          mapJsonStringTemplates.set(key, substr);
          return key;
        });

      if (sub.startsWith("[")) {
        const json = serializeJsonArray(sub.slice(1, -1), 0);
        mapJsons.set(key, `json!(${json.output})`);
      }

      else if (sub.startsWith("{")) {
        const json = serializeJsonObject(sub.slice(1, -1), 0);
        mapJsons.set(key, `json!(${json.output})`);
      }

      else {
        mapJsons.set(key, substr);
      }

      return key;
    })

    // string template expressions
    .replace(/\$\{[\s\S]*?\}/g, (substr) => {
      const key = getRandomKeyString(code);
      mapStringTemplateExpressions.set(key, substr);
      return key;
    })

    // jsx expressions (={...} for attributes or just {...} on element content)
    .replace(/(\=\{[\s\S]*?\})|(\{[\s\S]*?\})/g, (substr) => {
      const key = getRandomKeyString(code);

      if (substr.startsWith("=")) {
        mapExpressions.set(key, substr.slice(1));
        return `="${key}"`;
      }

      mapExpressions.set(key, substr);
      return key;
    });

  // map single quote and double back to code after finished map expression and expression values
  mapQuotes.forEach((value, key) => {
    code = code.replaceAll(key, value);
  });

  // generate html
  const jsxCode = `export const sample = () => (${code});`;
  const jsxHtml = await jsxToString("sample", jsxCode).catch(() => null);

  if (typeof jsxHtml !== "string") {
    // error to format jsx to html
    return null;
  }

  let output = jsxHtml;

  // map original data back after generated html
  // order: jsx expr -> string template expr -> json -> json string template -> json string templat expr -> quote
  mapExpressions.forEach((value, key) => {
    // flatten from {`text${...}`} to text${...}
    if (value.startsWith("{`") && value.endsWith("`}")) {
      output = output.replaceAll(key, value.slice(2, -2));
    } else {
      output = output.replaceAll(key, "$" + value);
    }
  });

  mapStringTemplateExpressions.forEach((value, key) => {
    // flatten from ${`text${...}`} to text${...}
    if (value.startsWith("${`") && value.endsWith("`}")) {
      const val = value.slice(3, -2);
      output = output.replaceAll(key, val);
    } else {
      output = output.replaceAll(key, value);
    }
  });

  mapJsons.forEach((value, key) => {
    output = output.replaceAll(key, value);
  });

  mapJsonStringTemplates.forEach((value, key) => {
    output = output.replaceAll(key, value);
  });

  mapJsonStringTemplateExpressions.forEach((value, key) => {
    output = output.replaceAll(key, value);
  });

  mapQuotes.forEach((value, key) => {
    output = output.replaceAll(key, value);
  });

  return output;
}