import { OutputType } from "../types";

const rust = `#[macro_export]
macro_rules! escape_quot {
    ($fmt:expr, $($arg:tt)*) => {
        format!($fmt, $($arg)*).replace('"', "&quot;")
    }
}
`;

const ts = `export function escape_quot(input: unknown): string {
  return \`\${input}\`.replace(/"/g, "&quot;");
}`;

export function getEscapeQuot(type: OutputType) {
  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    return rust;
  }

  return ts;
}