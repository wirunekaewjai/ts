export enum OutputType {
  TS_JSX = "typescript jsx",
  TS_STRING = "typescript html string",
  RS_MACRO = "rust html macro",
  RS_STRING = "rust html string",
}

export interface Config {
  namespace?: string;
  dir: string;
  type: OutputType;
}