// AUTO GENERATED
pub struct PostContentPost {
    title: String,
    body: String,
}

pub fn post_content(post: PostContentPost) -> String {
    return format!(
        r#"<div class="p-2 space-y-2"><h1 class="text-xl">{}</h1><p>{}</p></div>"#,
        post.title, post.body
    );
}

/*
(
  <div class="p-2 space-y-2">
    <h1 class="text-xl">{post.title}</h1>
    <p>
      {post.body}
    </p>
  </div>
);
*/
