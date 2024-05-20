#[macro_export]
macro_rules! escape {
    ($str:expr) => {
        match $str {
            str => str.replace(""", "&quot;"), // &str input
            String(s) => s.replace(""", "&quot;"), // String input
        }
    };
}
