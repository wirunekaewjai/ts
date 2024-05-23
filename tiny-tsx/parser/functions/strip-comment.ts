export function stripComment(input: string) {
  return input.replace(/\/\*[\s\S]*?\*\//g, "");
}