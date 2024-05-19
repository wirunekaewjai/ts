import { TinyRouter, type TinyRouteHandler, type TinyRouteInvoker } from "../tiny-router";

export class HtmxInterceptor {
  private router: TinyRouter;

  public constructor() {
    this.router = new TinyRouter();
    this.intercept();
  }

  public add(path: string, handler: TinyRouteHandler) {
    this.router.add(path, handler);
  }

  public remove(path: string) {
    this.router.remove(path);
  }

  private intercept() {
    const router = this.router;
    const OriginalXMLHttpRequest = window.XMLHttpRequest;

    class InterceptedXMLHttpRequest extends OriginalXMLHttpRequest {
      private headers: Record<string, string> = {};

      private url: string | null = null;
      private invoker: TinyRouteInvoker | null = null;

      setRequestHeader(name: string, value: string): void {
        this.headers[name] = value;
        super.setRequestHeader(name, value);
      }

      open(method: string, url: string | URL): void;
      open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
      open(...args: [string, string | URL]): void {
        const method = args[0];
        const url = args[1];

        if (method === "GET" && typeof url === "string") {
          // start intercept
          const invoker = router.match(url);

          if (invoker) {
            this.url = url;
            this.invoker = invoker;

            console.debug("intercept:", url);
          }
        }

        super.open(...args);
      }

      send(body?: Document | XMLHttpRequestBodyInit | null) {
        const isHxRequest = this.headers["HX-Request"];

        if (!isHxRequest || !this.url || !this.invoker) {
          // default behavior
          super.send(body);
          return;
        }

        const url = this.url;

        // TODO: handle error
        this.invoker().then((response: any) => {
          [
            "response",
            "responseText",
            "responseURL",
            "readyState",
            "status",
            "statusText",
          ].forEach((name) => Object.defineProperty(this, name, { writable: true }));

          (this.response as string) = (this.responseText as string) = response ?? "";
          (this.responseURL as string) = new URL(url, window.location.origin).href;
          (this.readyState as number) = XMLHttpRequest.DONE;
          (this.status as number) = 200;
          (this.statusText as string) = "OK";

          this.onload?.(new ProgressEvent(""));
        });
      }
    };

    window.XMLHttpRequest = InterceptedXMLHttpRequest;
  }
}