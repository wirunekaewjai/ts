// AUTO GENERATED
export const counter = (count: number) => (
  <div
    class="p-2 flex flex-row items-center"
    hx-target="this"
    hx-swap="outerHTML"
  >
    <button
      class="w-8 h-8 bg-red-600 text-white rounded-md shadow-md"
      hx-get={`/@counter?count=${count - 1}`}
      hx-trigger="click"
      hx-replace-url={`/counter?count=${count - 1}`}
    >
      {"-"}
    </button>
    <div class="flex items-center px-4 h-8 mx-2 border rounded-md">
      {count}
    </div>
    <button
      class="w-8 h-8 bg-blue-600 text-white rounded-md shadow-md"
      hx-get={`/@counter?count=${count + 1}`}
      hx-trigger="click"
      hx-replace-url={`/counter?count=${count + 1}`}
    >
      {"+"}
    </button>
  </div>
);