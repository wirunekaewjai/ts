// AUTO GENERATED
use html_to_string_macro::html;

pub fn counter(count: i32) -> String {
    return html!(
      <div
        class="p-2 flex flex-row items-center"
        hx-target="this"
        hx-swap="outerHTML"
      >
        <button
          class="w-8 h-8 bg-red-600 text-white rounded-md shadow-md"
          hx-get="/@counter"
          hx-vals={escape!(format!("{{\"count\"\"count - 1\"{}}}", count - 1))}
        >
          {"+"}
        </button>
      </div>
    );
}
