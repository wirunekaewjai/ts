// AUTO GENERATED
export const suspense = (href: string) => (
  <div
    class="p-2"
    hx-get={href}
    hx-trigger="load"
    hx-swap="outerHTML"
  >
    {"Loading . . ."}
  </div>
);