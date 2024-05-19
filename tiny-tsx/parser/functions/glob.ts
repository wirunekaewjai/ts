export function glob(cwd: string, ext: string) {
  const glob = new Bun.Glob(`**/*${ext}`);
  const iter = glob.scanSync({
    cwd,
  });

  return Array.from(iter);
}