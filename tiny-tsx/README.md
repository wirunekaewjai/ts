# Install
1. import runtime to project tsconfig
  
  ```jsxImportSource: "@wirunekaewjai/ts/tiny-tsx/runtime"```

2. create templates folder
3. create tsconfig for templates
4. include types.d.ts to tsconfig

  ```include: ["node_modules/@wirunekaewjai/ts/tiny-tsx/types.d.ts"]```

---

# Example 1
```ts
// example-1.tsx
(src: string, width: i32) => (
  <img
    alt="this is image"
    src={src}
    width={width}
  />
);
```

```ts
// output of example-1.tsx in Typescript
export const example_1 = (src: string, width: number) => (
  <img
    alt="this is image"
    src={src}
    width={width}
  />
);
```

```ts
// usage in Typescript
import { example_1 } from "./outputs/example-1.tsx";

function main() {
    const html = example_1("/favicon.ico", 32);
    console.log(html);
}
```

```rust
// output of example-1.tsx in Rust
use html_to_string_macro::html;

pub fn example_1(src: &str, width: i32) -> String {
    return html!(
      <img
        alt="this is image"
        src={src}
        width={width}
      />
    );
}
```

```rust
mod example_1;

pub use example_1::*;

fn main() {
    let html = example_1("/favicon.ico", 32);
    println!(html);
}
```

# Example 2
```ts
// example-2.tsx
interface Props {
    src: string;
    width: i32;
}

(props: Props) => (
  <img
    alt="this is image"
    src={props.src}
    width={props.width}
  />
);
```

```ts
// output of example-2.tsx in Typescript
export interface Example2Props {
  src: string;
  width: number;
}

export const example_2 = (props: Example2Props) => (
  <img
    alt="this is image"
    src={props.src}
    width={props.width}
  />
);
```

```ts
// usage in Typescript
import { example_2 } from "./outputs/example-2.tsx";

function main() {
    const html = example_2({
        src: "/favicon.ico",
        width: 32,
    });

    console.log(html);
}
```

```rust
// output of example-2.tsx in Rust
use html_to_string_macro::html;

pub struct Example2Props {
    src: String,
    width: i32,
}

pub fn example_2(props: Example2Props) -> String {
    return html!(
      <img
        alt="this is image"
        src={props.src}
        width={props.width}
      />
    );
}
```

```rust
mod example_2;

pub use example_2::*;

fn main() {
    let html = example_2(Example2Props {
        src: "/favicon.ico".into(),
        width: 32,
    });

    println!(html);
}
```