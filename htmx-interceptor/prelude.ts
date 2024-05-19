import type HTMX from "htmx.org";
import { HtmxInterceptor } from "./htmx-interceptor";

declare global {
  var htmx: typeof HTMX;
  var interceptor: HtmxInterceptor;
}

window.interceptor = new HtmxInterceptor();
