# Install

```tsx
// import prelude on first line of client-side entrypoint
import "@wirunekaewjai/ts/htmx-interceptor/prelude";
import "...your_staff";

// register route
interceptor.get("/@add", ({ query }) => {
    const a = Number(query.a);
    const b = Number(query.b);

    return (
        <div>
            Result: {a + b}
        </div>
    );
});

// somewhere in your code
<button
    hx-get="/@add"
    hx-vals={{ a: 20, b: 7 }}
    hx-trigger="click"
    hx-swap="outerHTML"
>
    CLICK
</button>
```

