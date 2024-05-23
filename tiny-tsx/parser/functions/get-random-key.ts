export function getRandomKey(input: string) {
  const r = Math.round(Math.random() * 10_000_000_000);
  const rt = r.toString(10);

  if (input.includes(rt)) {
    return getRandomKey(input);
  }

  return r;
}