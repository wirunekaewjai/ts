// AUTO GENERATED
pub struct Example2Props {
    src: String,
    width: i32,
}

pub fn example_2(props: Example2Props) -> String {
    return format!(
        r#"<img alt="this is image" src="{}" width="{}">"#,
        props.src, props.width
    );
}

/*
(
  <img
    alt="this is image"
    src={props.src}
    width={props.width}
  />
);
*/
