// AUTO GENERATED
pub fn counter(count: i32) -> String {
    let v_0 = count - 1;
    let v_1 = count - 1;
    let v_2 = count;
    let v_3 = count + 1;
    let v_4 = count + 1;

    return format!(r#"<div class="p-2 flex flex-row items-center" hx-target="this" hx-swap="outerHTML"><button class="w-8 h-8 bg-red-600 text-white rounded-md shadow-md" hx-get="/@counter?count={}" hx-trigger="click" hx-replace-url="/counter?count={}">-</button><div class="flex items-center px-4 h-8 mx-2 border rounded-md">{}</div><button class="w-8 h-8 bg-blue-600 text-white rounded-md shadow-md" hx-get="/@counter?count={}" hx-trigger="click" hx-replace-url="/counter?count={}">+</button></div>"#, v_0, v_1, v_2, v_3, v_4);
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
      hx-get={`/@counter?count=${count - 1}`}
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
    >
      {"+"}
    </button>
  </div>
);
*/
