import { pathToParamsMapper } from "./functions/path-to-params-mapper";
import { pathToRegex } from "./functions/path-to-regex";
import type { TinyRequest, TinyRoute, TinyRouteHandler, TinyRouteInvoker } from "./types";

export class TinyRouter {
  private routes: TinyRoute[] = [];

  public add(path: string, handler: TinyRouteHandler) {
    this.routes.push({
      handler,
      path,
      pathParamsMapper: pathToParamsMapper(path),
      pathRegex: pathToRegex(path),
    });
  }

  public remove(path: string) {
    this.routes = this.routes.filter((route) => route.path !== path);
  }

  public match(path: string): TinyRouteInvoker | null {
    for (const route of this.routes) {
      const [pathname, search] = path.split("?");
      const values = pathname.match(route.pathRegex);

      if (values) {
        const params: Record<string, string> = {};
        const query: Record<string, string> = {};

        route.pathParamsMapper.forEach((index, key) => {
          params[key] = values[index];
        });

        if (search) {
          new URLSearchParams(search).forEach((value, key) => {
            query[key] = value;
          });
        }

        const request: TinyRequest = {
          params,
          path: pathname,
          query,
        };

        return async () => await route.handler(request);
      }
    }

    return null;
  }
}
