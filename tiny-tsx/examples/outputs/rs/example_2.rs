// AUTO GENERATED
use html_to_string_macro::html;

pub struct Example2Props {
    src: String,
    width: i32,
}

pub fn example_2(props: Example2Props) -> String {
    return html!(
      <img
        alt="this is image"
        src={props.src}
        width={props.width}
      />
    );
}
