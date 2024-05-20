export function extractTemplateInterfaces(input: string) {
  const items: string[] = [];

  input.replace(/interface\s[A-z][A-z0-9_]*\s{\s*([A-z][A-z0-9_]+:\s*[A-z0-9]+;\s*)*}/g, (substr) => {
    items.push(substr);
    return "";
  });

  return items;
}