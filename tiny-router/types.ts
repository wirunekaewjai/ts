export interface TinyRoute {
  handler: TinyRouteHandler;
  path: string;
  pathParamsMapper: Map<string, number>;
  pathRegex: RegExp;
}

export interface TinyRequest {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

export type TinyRouteHandler = (request: TinyRequest) => Promise<unknown> | unknown;
export type TinyRouteInvoker = () => Promise<unknown>;