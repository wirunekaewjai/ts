export function stripComment(input: string) {
  const now = Date.now().toString(16);
  const hash = Bun.hash.wyhash(now).toString(16);
  const map: Map<string, string> = new Map();

  let output = input
    .replace(/("[^"]+")|('[^']+')|(`[^`]+`)/g, (substr) => {
      const key = `${hash}_${map.size}`;
      map.set(key, substr);
      return key;
    })
    .replace(/\/\/[^\r\n]*/g, "")
    .split(/\r?\n/g)
    .filter((x) => x.trim().length > 0)
    .join("\n");

  map.forEach((value, key) => {
    output = output.replace(key, value);
  });

  return output;
}