interface Post {
  title: string;
  body: string;
}

(post: Post) => (
  <div class="p-2 space-y-2">
    <h1 class="text-xl">{post.title}</h1>
    <p>
      {post.body}
    </p>
  </div>
);