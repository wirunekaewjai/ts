import { OutputType } from "../types";

const rust = `#[macro_export]
macro_rules! format_json {
    ($fmt:expr, $($arg:tt)*) => {
        format!($fmt, $($arg)*).replace('"', "&quot;")
    }
}
`;

const ts = `export function formatJson(input: string): string {
  return input.replace(/"/g, "&quot;");
}`;

export function getFormatJsonMacro(type: OutputType) {
  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    return rust;
  }

  return ts;
}