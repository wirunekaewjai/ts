// AUTO GENERATED
use html_to_string_macro::html;

pub fn suspense(href: &str) -> String {
    return html!(
      <div
        class="p-2"
        hx-get={href}
        hx-trigger="load"
        hx-swap="outerHTML"
      >
        {"Loading . . ."}
      </div>
    );
}
