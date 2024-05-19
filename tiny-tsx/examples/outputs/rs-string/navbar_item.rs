// AUTO GENERATED
pub fn navbar_item(href: &str, active: bool, content: &str) -> String {
    let v_0 = href;
    let v_1 = active;
    let v_2 = content;

    return format!(r#"<a class="p-2 hover:bg-white/10 rounded-full data-[active=true]:bg-white/20 data-[active=true]:pointer-events-none" href="{}" data-active="{}">{}</a>"#, v_0, v_1, v_2);
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
