import { parseForRust } from "./functions/parse-for-rust";
import { parseForTypescript } from "./functions/parse-for-typescript";

export class TinyTsxParser {
  public constructor(
    private readonly srcDir: string,
    private readonly outDir: string,
    private readonly outExt: ".rs" | ".tsx",
  ) { }

  public async parse() {
    if (this.outExt === ".rs") {
      return await parseForRust(this.srcDir, this.outDir);
    }

    return await parseForTypescript(this.srcDir, this.outDir);
  }
}