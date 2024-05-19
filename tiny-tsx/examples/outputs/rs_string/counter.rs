// AUTO GENERATED
pub fn counter(count: i32) -> String {
    return format!(
        r#"<div class="p-2 flex flex-row items-center" hx-target="this" hx-swap="outerHTML"><button class="w-8 h-8 bg-red-600 text-white rounded-md shadow-md" hx-get="/@counter" hx-vals="{}" hx-trigger="click" hx-replace-url="{}">-</button><div class="flex items-center px-4 h-8 mx-2 border rounded-md">{}</div><button class="w-8 h-8 bg-blue-600 text-white rounded-md shadow-md" hx-get="{}" hx-trigger="click" hx-replace-url="{}" hx-vals="{}" hx-vals2="{}">+</button></div>"#,
        format!("{{&quot;count&quot;:{}}}", count - 1),
        format!("/counter?count={}", count - 1),
        count,
        format!("/@counter?count={}", count + 1),
        format!("/counter?count={}", count + 1),
        format!(
            "{{&quot;count&quot;:{},&quot;value&quot;:1,&quot;hello&quot;:&quot;world&quot;}}",
            count
        ),
        "{&quot;hello&quot;:&quot;world&quot;}"
    );
}

/*
(
  <div
    class="p-2 flex flex-row items-center"
    hx-target="this"
    hx-swap="outerHTML"
  >
    <button
      class="w-8 h-8 bg-red-600 text-white rounded-md shadow-md"
      hx-get="/@counter"
      hx-vals={{
        "count": count - 1,
      }}
      hx-trigger="click"
      hx-replace-url={`/counter?count=${count - 1}`}
    >
      {"-"}
    </button>
    <div class="flex items-center px-4 h-8 mx-2 border rounded-md">
      {count}
    </div>
    <button
      class="w-8 h-8 bg-blue-600 text-white rounded-md shadow-md"
      hx-get={`/@counter?count=${count + 1}`}
      hx-trigger="click"
      hx-replace-url={`/counter?count=${count + 1}`}
      hx-vals={{
        count,
        "value": 1,
        "hello": "world",
      }}
      hx-vals2={{
        "hello": "world",
      }}
    >
      {"+"}
    </button>
  </div>
);
*/
