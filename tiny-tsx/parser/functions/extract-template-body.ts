export function extractTemplateBody(input: string) {
  const m = input.match(/\([^)]*\)\s*=>\s*\([^;]+;/);

  if (m) {
    const arr = m[0].split("=>").map((x) => x.trim());

    return {
      args: arr[0].trim().slice(1, -1).split(",").filter((e) => !!e).map((e) => e.trim()),
      content: arr[1],
    };
  }

  return null;
}