import { TinyTsxParser } from "@wirunekaewjai/ts/tiny-tsx";
import { styleText } from "node:util";

const parser = new TinyTsxParser("templates");

console.log(styleText("blue", "===== parse for typescript jsx ====="));
await parser.parse("typescript_jsx", "outputs/ts");
console.log();

console.log(styleText("blue", "===== parse for rust html macro ====="));
await parser.parse("rust_html_macro", "outputs/rs");
console.log();

console.log(styleText("blue", "===== parse for typescript html string ====="));
await parser.parse("typescript_html_string", "outputs/ts-string", "view");
console.log();

console.log(styleText("blue", "===== parse for rust html string ====="));
await parser.parse("rust_html_string", "outputs/rs-string");
console.log();