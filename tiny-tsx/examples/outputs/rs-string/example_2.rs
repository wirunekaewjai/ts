// AUTO GENERATED
pub struct Example2Props {
    src: String,
    width: i32,
}

pub fn example_2(props: Example2Props) -> String {
    let v_0 = props.src;
    let v_1 = props.width;

    return format!(r#"<img alt="this is image" src="{}" width="{}">"#, v_0, v_1);
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
