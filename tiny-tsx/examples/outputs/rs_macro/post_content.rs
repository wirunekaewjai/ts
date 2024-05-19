// AUTO GENERATED
use html_to_string_macro::html;

pub struct PostContentPost {
    title: String,
    body: String,
}

pub fn post_content(post: PostContentPost) -> String {
    return html!(
      <div class="p-2 space-y-2">
        <h1 class="text-xl">{post.title}</h1>
        <p>
          {post.body}
        </p>
      </div>
    );
}
