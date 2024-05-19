// AUTO GENERATED
use html_to_string_macro::html;

pub fn example_1(src: &str, width: i32) -> String {
    return html!(
      <img
        alt="this is image"
        src={src}
        width={width}
      />
    );
}
