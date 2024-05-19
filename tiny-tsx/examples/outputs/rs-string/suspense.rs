// AUTO GENERATED
pub fn suspense(href: &str) -> String {
    return format!(
        r#"<div class="p-2" hx-get="{}" hx-trigger="load" hx-swap="outerHTML">Loading . . .</div>"#,
        href
    );
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
