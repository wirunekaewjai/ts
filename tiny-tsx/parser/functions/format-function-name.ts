export function formatFunctionName(namespace: string, name: string) {
  if (namespace) {
    return namespace + name;
  }

  return name;
}