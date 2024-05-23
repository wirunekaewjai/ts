import { getRandomKeyString } from "./get-random-key-string";

export async function buildRustContent(input: string) {
  const mapJsonTemplateExpressions = new Map<string, string>();
  const mapJsonTemplates = new Map<string, string>();
  const mapJsons = new Map<string, string>();

  let output = input;

  output = output.replace(/(json\!\(\{[\s\S]*?\}\))|(json\!\(\[[\s\S]*?\]\))/g, (substr) => {
    const key = getRandomKeyString(output);
    const val = substr
      // string template expressions
      .replace(/\$\{[\s\S]*?\}/g, (substr) => {
        const key = getRandomKeyString(input);
        const val = substr;

        mapJsonTemplateExpressions.set(key, val);
        return key;
      })

      // string template literal
      .replace(/\`[\s\S]*?\`/g, (substr) => {
        const key = getRandomKeyString(input);
        const val = substr.slice(1, -1);

        mapJsonTemplates.set(key, val);
        return key;
      });

    mapJsons.set(key, val);
    return key;
  });

  let args: string[] = [];

  // string template expressions
  output = output.replace(/\$\{[\s\S]*?\}/g, (substr) => {
    const sub = substr.slice(2, -1).trim();
    args.push(sub);

    return "{}";
  });

  mapJsonTemplates.forEach((value, key) => {
    mapJsonTemplateExpressions.forEach((v, k) => {
      value = value.replaceAll(k, v);
    });

    const jsonArgs: string[] = [];

    // string template expressions
    value = value.replace(/\$\{[\s\S]*?\}/g, (substr) => {
      const sub = substr.slice(2, -1).trim();
      jsonArgs.push(sub);

      return "{}";
    });

    if (jsonArgs.length > 0) {
      mapJsonTemplates.set(key, `format!(r#"${value}"#, ${jsonArgs.join(", ")})`);
    } else {
      mapJsonTemplates.set(key, `format!(r#"${value}"#)`);
    }
  });

  args = args.map((arg) => {
    let jsonArg = mapJsons.get(arg);

    if (jsonArg) {
      mapJsonTemplates.forEach((value, key) => {
        jsonArg = jsonArg?.replaceAll(key, value);
      });

      return jsonArg;
    }

    return arg;
  });

  if (args.length > 0) {
    return `format!(r#"${output}"#, ${args.join(", ")})`;
  }

  return `format!(r#"${output}"#)`;
}