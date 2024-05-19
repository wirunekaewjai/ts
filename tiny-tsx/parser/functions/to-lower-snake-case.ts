export function toLowerSnakeCase(input: string) {
  return input.toLowerCase().replace(/[-]/g, "_");
}