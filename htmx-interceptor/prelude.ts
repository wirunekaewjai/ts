import type HTMX from "htmx.org";
import { HxInterceptor } from "./hx-interceptor";

declare global {
  var htmx: typeof HTMX;
  var interceptor: HxInterceptor;
}

window.interceptor = new HxInterceptor();
