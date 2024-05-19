// AUTO GENERATED
pub fn suspense(href: &str) -> String {
    let v_0 = href;

    return format!(r#"<div class="p-2" hx-get="{}" hx-trigger="load" hx-swap="outerHTML">Loading . . .</div>"#, v_0);
}

/*
(
  <div
    class="p-2"
    hx-get={href}
    hx-trigger="load"
    hx-swap="outerHTML"
  >
    {"Loading . . ."}
  </div>
);
*/
