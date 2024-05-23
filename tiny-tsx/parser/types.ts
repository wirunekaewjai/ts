export enum OutputType {
  // TS_JSX = "typescript jsx",
  // TS_STRING = "typescript html string",
  // RS_MACRO = "rust html macro",
  // RS_STRING = "rust html string",

  TS_HTML = "typescript html",
  RS_HTML = "rust html"
}

export interface Config {
  namespace?: string;
  dir: string;
  type: OutputType;
}