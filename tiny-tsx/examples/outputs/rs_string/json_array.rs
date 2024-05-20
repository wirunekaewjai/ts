// AUTO GENERATED
pub fn json_array() -> String {
    return format!(
        r#"<div x-json="{}">Hello, World</div>"#,
        escape!("{\"Alvl1_1\"\"a\"\"arr\"[\"a\",\"b,c\",1,{\"hello\"123}]}")
    );
}

/*
(
  <div
    x-json={{
      "Alvl1_1": "a",
      "arr": [
        "a",
        "b,c",
        1,
        {
          "hello": 123,
        },
      ]
    }}
  >
    {"Hello, World"}
  </div>
);
*/
