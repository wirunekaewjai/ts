(href: string, active: boolean, content: string) => (
  <a
    class="p-2 hover:bg-white/10 rounded-full data-[active=true]:bg-white/20 data-[active=true]:pointer-events-none"
    href={href}
    data-active={active}
  >
    {content}
  </a>
);