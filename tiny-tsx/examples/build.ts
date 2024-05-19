import { TinyTsxParser } from "@wirunekaewjai/ts/tiny-tsx";
import { OutputType } from "../parser/types";

const parser = new TinyTsxParser(
  "templates",
  [
    {
      dir: "outputs/ts_jsx",
      type: OutputType.TS_JSX,
    },
    {
      dir: "outputs/ts_string",
      type: OutputType.TS_STRING,
    },
    {
      dir: "outputs/rs_macro",
      type: OutputType.RS_MACRO,
    },
    {
      dir: "outputs/rs_string",
      type: OutputType.RS_STRING,
    },
  ],
);

await parser.parse();