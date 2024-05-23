import { OutputType } from "../types";

export function getExtension(type: OutputType) {
  if (type === OutputType.RS_HTML) {
    return ".rs";
  }

  // if (type === OutputType.TS_JSX) {
  //   return ".tsx";
  // }

  return ".ts";
}