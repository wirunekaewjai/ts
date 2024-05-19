// AUTO GENERATED
use html_to_string_macro::html;

pub fn navbar(content: &str) -> String {
    return html!(
      <nav
        class="flex flex-row items-center bg-black text-white p-2 space-x-4"
        hx-boost="true"
      >
        <img
          src="/favicon.ico"
          width="32"
        />
        {content}
      </nav>
    );
}
