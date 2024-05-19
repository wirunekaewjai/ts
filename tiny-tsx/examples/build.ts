import { TinyTsxParser } from "@wirunekaewjai/ts/tiny-tsx";
import { styleText } from "node:util";

const parserTsx = new TinyTsxParser("templates", "outputs/ts", ".tsx");
const parserRs = new TinyTsxParser("templates", "outputs/rs", ".rs");

console.log(styleText("blue", "===== parse for typescript ====="));
await parserTsx.parse();
console.log();

console.log(styleText("blue", "===== parse for rust ====="));
await parserRs.parse();
console.log();