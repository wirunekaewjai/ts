export function pathToRegex(path: string) {
  const pattern = path
    // star
    .replace(/\*/g, ".*")

    // multiple slash
    .replace(/:[^\/]+\+/g, "(.+)")

    // single slash
    .replace(/:[^\/]+/g, "([^\\/]+)");

  return new RegExp(
    "^" + pattern + "$"
  );
}