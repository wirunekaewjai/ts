import type { JSXChildren } from "./types";

const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

function renderChildren(children: JSXChildren): string {
  if (Array.isArray(children)) {
    return children.map(renderChildren).join("");
  }

  else if (typeof children === "string" || typeof children === "number" || typeof children === "boolean") {
    return children.toString();
  }

  return "";
}

function replaceQuot(value: string) {
  return value.replace(/"/g, "&quot;");
}

function renderAttrValue(value: any) {
  if (typeof value === "object" || Array.isArray(value)) {
    return replaceQuot(JSON.stringify(value));
  }

  if (typeof value === "string") {
    return replaceQuot(value);
  }

  return value;
}

function renderAttrs(attrs: Record<string, any>) {
  let text = "";

  for (const key in attrs) {
    const value = attrs[key];

    if (value === true) {
      text += " " + key;
    }

    else if (typeof value !== "undefined" && value !== null) {
      text += ` ${key}="${renderAttrValue(value)}"`;
    }
  }

  return text;
}

export function render(type: Function | string | undefined, props: Record<string, any>) {
  if (typeof type === "function") {
    return type(props ?? {});
  }

  const { children, ...attrs } = props;

  if (typeof type === "string") {
    let text = "";

    if (type === "html") {
      text += "<!DOCTYPE html>";
    }

    text += "<" + type + renderAttrs(attrs) + ">";

    if (!SELF_CLOSING_TAGS.has(type)) {
      text += renderChildren(children) + "</" + type + ">";
    }

    return text;
  }

  return renderChildren(children);
}

export function renderFragment(props: Record<string, any>) {
  if (props) {
    return renderChildren(props.children);
  }

  return "";
}