// AUTO GENERATED
pub fn navbar_item(href: &str, active: bool, content: &str) -> String {
    return format!(
        r#"<a class="p-2 hover:bg-white/10 rounded-full data-[active=true]:bg-white/20 data-[active=true]:pointer-events-none" href="{}" data-active="{}">{}</a>"#,
        href, active, content
    );
}

/*
(
  <a
    class="p-2 hover:bg-white/10 rounded-full data-[active=true]:bg-white/20 data-[active=true]:pointer-events-none"
    href={href}
    data-active={active}
  >
    {content}
  </a>
);
*/
