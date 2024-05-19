export function toPascalCase(input: string) {
  return input
    .toLowerCase()
    .split(/[-_]/)
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join("");
}