// AUTO GENERATED
use html_to_string_macro::html;

pub fn json_array() -> String {
    return html!(
      <div
        x-json={escape!("{\"Alvl1_1\"\"a\"\"arr\"[\"a\",\"b,c\",1,{\"hello\"123}]}")}
      >
        {"Hello, World"}
      </div>
    );
}
