#[macro_export]
macro_rules! json_esc {
    ($($json:tt)+) => {
        serde_json::json!($($json)+).to_string().replace('"', "&quot;")
    };
}
