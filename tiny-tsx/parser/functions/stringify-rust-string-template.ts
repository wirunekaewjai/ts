export function stringifyRustStringTemplate(input: string) {
  const args: string[] = [];

  input = input.replace(/\${[^}]+}/g, (substr) => {
    substr = substr.slice(2, -1);
    args.push(substr);
    return "{}";
  });

  if (args.length > 0) {
    return `format!("${input}", ${args.join(", ")})`;
  }

  return `"${input}"`;
}