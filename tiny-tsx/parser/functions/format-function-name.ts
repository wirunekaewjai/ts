export function formatFunctionName(namespace: string, name: string) {
  if (namespace) {
    return namespace + "_" + name;
  }

  return name;
}