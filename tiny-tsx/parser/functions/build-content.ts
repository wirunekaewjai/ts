import { OutputType } from "../types";
import { jsxToString } from "./jsx-to-string";
import { stringifyRustJson } from "./stringify-rust-json";
import { stringifyRustStringTemplate } from "./stringify-rust-string-template";
import { stringifyTypescriptJson } from "./stringify-typescript-json";

function wrap(type: OutputType, input: string, args: string[]) {
  let output = input;

  if (type === OutputType.RS_MACRO) {
    output = output.split(/\r?\n/g)
      .map((line, index) => {
        if (index === 0) {
          return line;
        }

        if (line.trim() === "") {
          return "";
        }

        return "    " + line;
      })
      .join("\n");

    if (output.trim().length === 0) {
      output = `"".into();`;
    } else {
      output = `html!${output}`;
    }
  }

  else if (type === OutputType.RS_STRING) {
    if (args.length > 0) {
      output = `format!(r#"${output}"#, ${args.join(", ")});`;
    } else {
      output = `"${output}".into();`;
    }
  }

  else if (type === OutputType.TS_STRING) {
    output = "`" + output + "`;";
  }

  else if (type === OutputType.TS_JSX) {
    if (output.trim().length === 0) {
      return `"";`;
    }
  }

  return output;
}

export async function buildContent(type: OutputType, input: string) {
  const now = Date.now().toString(16);
  const hash = Bun.hash.wyhash(now).toString(16);
  const expressions: Map<string, string> = new Map();

  let output = input
    // json | string template | double quote | single quote | variable
    .replace(/({{[^]+}})|({`[^`]+`})|({"[^"]+"})|({'[^']+'})|({[^}]+})/g, (substr) => {
      const key = `${hash}_${expressions.size}`;
      const value = substr;

      expressions.set(key, value);

      return `{"${key}"}`;
    });

  if (type === OutputType.TS_STRING || type === OutputType.RS_STRING) {
    output = await jsxToString("temp", `export const temp = () => ${output}`);

    if (!output) {
      // failed to parse jsx to html string
      return wrap(type, "", []);
    }
  }

  const outputArgs: string[] = [];

  for (const [key, expression] of expressions) {
    if (type === OutputType.TS_JSX) {
      output = output.replace(`{"${key}"}`, expression);
      continue;
    }

    if (type === OutputType.TS_STRING) {
      if (expression.startsWith('{"')) {
        // double quote
        output = output.replace(key, expression.slice(2, -2));
      }

      else if (expression.startsWith("{'")) {
        // single quote
        output = output.replace(key, expression.slice(2, -2));
      }

      else if (expression.startsWith("{`")) {
        // string template
        output = output.replace(key, "$" + expression);
      }

      else if (expression.startsWith("{{")) {
        // json
        output = output.replace(key, stringifyTypescriptJson(expression.slice(2, -2)));
      }

      else {
        // variable
        output = output.replace(key, "$" + expression);
      }

      continue;
    }

    if (type === OutputType.RS_MACRO) {
      if (expression.startsWith('{"')) {
        // double quote
        output = output.replace(`{"${key}"}`, expression);
      }

      else if (expression.startsWith("{'")) {
        // single quote
        output = output.replace(`{"${key}"}`, `{"${expression.slice(2, -2)}"}`);
      }

      else if (expression.startsWith("{`")) {
        // string template
        output = output.replace(`{"${key}"}`, `{${stringifyRustStringTemplate(expression.slice(2, -2))}}`);
      }

      else if (expression.startsWith("{{")) {
        // json
        output = output.replace(`{"${key}"}`, `{${stringifyRustJson(expression.slice(2, -2))}}`);
      }

      else {
        // variable
        output = output.replace(`{"${key}"}`, expression);
      }

      continue;
    }

    if (type === OutputType.RS_STRING) {
      if (expression.startsWith('{"')) {
        // double quote
        output = output.replace(key, expression.slice(2, -2));
      }

      else if (expression.startsWith("{'")) {
        // single quote
        output = output.replace(key, expression.slice(2, -2));
      }

      else if (expression.startsWith("{`")) {
        // string template
        output = output.replace(key, "{}");
        outputArgs.push(stringifyRustStringTemplate(expression.slice(2, -2)));
      }

      else if (expression.startsWith("{{")) {
        // json
        output = output.replace(key, "{}");
        outputArgs.push(stringifyRustJson(expression.slice(2, -2)));
      }

      else {
        // variable
        output = output.replace(key, "{}");
        outputArgs.push(expression.slice(1, -1));
      }

      continue;
    }
  }

  return wrap(type, output, outputArgs);
}