export function json_esc(input: unknown) {
  return JSON.stringify(input).replace(/"/g, "&quot;");
}