// AUTO GENERATED
use html_to_string_macro::html;

pub fn navbar_item(href: &str, active: bool, content: &str) -> String {
    return html!(
      <a
        class="p-2 hover:bg-white/10 rounded-full data-[active=true]:bg-white/20 data-[active=true]:pointer-events-none"
        href={href}
        data-active={active}
      >
        {content}
      </a>
    );
}
