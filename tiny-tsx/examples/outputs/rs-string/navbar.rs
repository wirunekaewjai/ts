// AUTO GENERATED
use html_to_string_macro::html;

pub fn navbar(content: &str) -> String {
    let v_0 = content;

    return format!(r#"<nav class="flex flex-row items-center bg-black text-white p-2 space-x-4" hx-boost="true"><img src="/favicon.ico" width="32">{}</nav>"#, v_0);
}
