export function stripCommentScope(input: string) {
  return input.replace(/\/\*[\s\S]*?\*\//g, "");
}