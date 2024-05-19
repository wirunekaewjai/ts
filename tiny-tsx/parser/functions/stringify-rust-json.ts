const QUOTE = "&quot;";

function isVar(input: string) {
  try {
    JSON.parse(input);
    return false;
  } catch {
    return true;
  }
}

function getKey(input: string) {
  if (input.startsWith("//")) {
    return null;
  }

  if (isVar(input)) {
    return `${QUOTE}${input}${QUOTE}`;
  }

  return input.replace(/"/g, QUOTE);
}

export function stringifyRustJson(input: string) {
  const pairs: string[] = [];
  const args: string[] = [];

  input
    .trim()
    .replace(/[^,]+/g, (substr) => {
      const arr = substr.trim().split(":").map((x) => x.trim());
      const key = getKey(arr[0]);

      if (!key) {
        return "";
      }

      if (isVar(arr[1])) {
        const value = arr[1] ?? arr[0];

        args.push(value);
        pairs.push(`${key}:{}`);
      } else {
        pairs.push(`${key}:${arr[1].replace(/"/g, "&quot;")}`);
      }

      return "";
    });

  const text = pairs.join(",");

  if (args.length > 0) {
    return `format!("{{${text}}}", ${args.join(", ")})`;
  }

  return `"{` + text + `}"`;
}