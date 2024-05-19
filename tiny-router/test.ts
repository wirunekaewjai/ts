import { TinyRouter } from "./tiny-router";

const paths = [
  "/",
  "/posts",
  "/posts?keyword=hello",
  "/posts/1",
  "/posts/1?key=value",
  "/posts/abc",
  "/posts/a/b/c",
  "/albums",
  "/albums/1",
  "/assets/hello.jpg",
  "/assets/abcde/hello.jpg",
  "/assets/abcde/nested/deep/hello.jpg",
  "/others",
  "/others/a",
  "/others/a/b",
  "/others/a/b/c",
  "/favicon.ico",
];

const router = new TinyRouter();

router.add("/", () => {
  console.log("homepage");
});

router.add("/posts", ({ query }) => {
  console.log("posts", query);
});

router.add("/posts/:id", ({ params, query }) => {
  console.log("post:", params.id, query);
});

router.add("/albums", () => {
  console.log("albums");
});

router.add("/assets/:hash/:filename+", ({ params }) => {
  console.log("asset", params.hash, params.filename);
});

router.add("/others*", ({ path }) => {
  console.log("others", path);
});

router.add("*", ({ path }) => {
  console.log("all", path);
});

for (const path of paths) {
  const handler = router.match(path);
  await handler?.();
}