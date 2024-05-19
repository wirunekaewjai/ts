import { parseForRustHtmlMacro } from "./functions/parse-for-rust-html-macro";
// import { parseForRustHtmlString } from "./functions/parse-for-rust-html-string";
// import { parseForTypescriptHtmlString } from "./functions/parse-for-typescript-html-string";
import { parseForTypescriptJsx } from "./functions/parse-for-typescript-jsx";
import type { OutputType } from "./types";

export class TinyTsxParser {
  public constructor(
    private readonly srcDir: string,
  ) { }

  public async parse(outType: OutputType, outDir: string, namespace = "") {
    if (outType === "typescript_jsx") {
      return await parseForTypescriptJsx(this.srcDir, outDir, namespace);
    }

    // if (outType === "typescript_html_string") {
    //   return await parseForTypescriptHtmlString(this.srcDir, outDir, namespace);
    // }

    if (outType === "rust_html_macro") {
      return await parseForRustHtmlMacro(this.srcDir, outDir, namespace);
    }

    // if (outType === "rust_html_string") {
    //   return await parseForRustHtmlString(this.srcDir, outDir, namespace);
    // }
  }
}