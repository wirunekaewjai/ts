// AUTO GENERATED
use html_to_string_macro::html;

pub fn heading(content: &str) -> String {
    return html!(
      <h1 class="p-2 font-bold text-xl">
        {content}
      </h1>
    );
}
