import type { HxRequestHandler } from "./types";

export class HxInterceptor {
  private map: Map<string, Map<string, HxRequestHandler>> = new Map();

  public constructor() {
    this.map.set("GET", new Map());
    this.intercept();
  }

  public get(path: string, handler: HxRequestHandler) {
    this.map.get("GET")?.set(path, handler);
  }

  private intercept() {
    const map = this.map;
    const OriginalXMLHttpRequest = window.XMLHttpRequest;

    class InterceptedXMLHttpRequest extends OriginalXMLHttpRequest {
      private headers: Record<string, string> = {};

      private url: string | null = null;
      private query: Record<string, string> | null = null;
      private handler: HxRequestHandler | null = null;

      setRequestHeader(name: string, value: string): void {
        this.headers[name] = value;
        super.setRequestHeader(name, value);
      }

      open(method: string, url: string | URL): void;
      open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
      open(...args: [string, string | URL]): void {
        const method = args[0];
        const url = args[1];

        if (typeof url === "string") {
          // start intercept
          const { pathname, searchParams } = new URL(url, window.location.origin);
          const handler = map.get(method)?.get(pathname);

          if (handler) {
            const query: Record<string, string> = {};

            searchParams.forEach((value, key) => {
              query[key] = value;
            });

            this.url = url;
            this.query = query;
            this.handler = handler;

            console.debug(method, url);
          }
        }

        super.open(...args);
      }

      send(body?: Document | XMLHttpRequestBodyInit | null) {
        const isHxRequest = this.headers["HX-Request"];

        if (!isHxRequest || !this.url || !this.query || !this.handler) {
          // default behavior
          super.send(body);
          return;
        }

        const url = this.url;
        const handler = this.handler({
          // TODO: add request body for POST
          query: this.query,
        });

        const onSuccess = (html: string) => {
          [
            "response",
            "responseText",
            "responseURL",
            "readyState",
            "status",
            "statusText",
          ].forEach((name) => Object.defineProperty(this, name, { writable: true }));

          (this.response as string) = (this.responseText as string) = html ?? "";
          (this.responseURL as string) = new URL(url, window.location.origin).href;
          (this.readyState as number) = XMLHttpRequest.DONE;
          (this.status as number) = 200;
          (this.statusText as string) = "OK";

          this.onload?.(new ProgressEvent(""));
        };

        if (handler instanceof Promise) {
          // TODO: handle error
          handler.then(onSuccess);
        } else {
          onSuccess(handler);
        }
      }
    };

    window.XMLHttpRequest = InterceptedXMLHttpRequest;
  }
}