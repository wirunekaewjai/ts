import { OutputType } from "../types";

const rust = `#[macro_export]
macro_rules! escape {
    ($str:expr) => {
        match $str {
            str => str.replace("\"", "&quot;"), // &str input
            String(s) => s.replace("\"", "&quot;"), // String input
        }
    };
}`;

export function getEscape(type: OutputType) {
  if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
    return rust;
  }

  return "";
}