export type HxRequestHandler = (request: HxRequest) => Promise<string> | string;
export type HxRequestBody = string | FormData | null | undefined;

export interface HxRequest {
  // TODO: add request body for POST
  query: Record<string, string>;
}
