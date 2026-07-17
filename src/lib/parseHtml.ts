import type { Block, BlockAttrs, CssStyle, HtmlTag } from "../types";
import { createId } from "./tree";
import { TAG_META } from "./tags";

const ALLOWED: HtmlTag[] = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "span", "div", "section", "article", "header", "footer", "nav",
  "main", "aside", "button", "a", "img", "ul", "ol", "li", "table",
  "thead", "tbody", "tr", "th", "td", "form", "input", "textarea",
  "select", "option", "label", "blockquote", "pre", "code", "hr", "br",
  "strong", "em", "small", "mark", "sub", "sup", "video", "audio",
  "iframe", "figure", "figcaption", "details", "summary", "dl", "dt", "dd",
];

function parseStyle(input: string | null): CssStyle | undefined {
  if (!input) return undefined;
  const styles: CssStyle = {};
  for (const raw of input.split(";")) {
    const idx = raw.indexOf(":");
    if (idx === -1) continue;
    const prop = raw.slice(0, idx).trim().toLowerCase();
    const value = raw.slice(idx + 1).trim();
    if (!value) continue;
    switch (prop) {
      case "color":
        styles.color = value;
        break;
      case "background-color":
        styles.backgroundColor = value;
        break;
      case "font-size":
        styles.fontSize = parseInt(value, 10) || undefined;
        break;
      case "padding":
        styles.padding = parseInt(value, 10) || undefined;
        break;
      case "border-radius":
        styles.borderRadius = parseInt(value, 10) || undefined;
        break;
      case "text-align":
        if (value === "left" || value === "center" || value === "right")
          styles.textAlign = value;
        break;
      case "border": {
        const m = value.match(/(\d+)px\s+solid\s+(.+)/);
        if (m) {
          styles.borderWidth = parseInt(m[1], 10);
          styles.borderColor = m[2].trim();
        }
        break;
      }
    }
  }
  return Object.keys(styles).length ? styles : undefined;
}

function parseAttrs(el: Element): BlockAttrs | undefined {
  const attrs: BlockAttrs = {};
  const src = el.getAttribute("src");
  const alt = el.getAttribute("alt");
  const href = el.getAttribute("href");
  if (src) attrs.src = src;
  if (alt) attrs.alt = alt;
  if (href) attrs.href = href;
  return Object.keys(attrs).length ? attrs : undefined;
}

function nodeToBlock(node: Element): Block {
  const tag = (node.tagName.toLowerCase() as HtmlTag) ?? "div";
  const usedTag: HtmlTag = ALLOWED.includes(tag) ? tag : "div";
  const meta = TAG_META[usedTag];

  const children: Block[] = [];
  let text: string | undefined;

  if (usedTag === "img") {
    const src = node.getAttribute("src");
    const alt = node.getAttribute("alt");
    return {
      id: createId(),
      tag: usedTag,
      attrs: { src: src ?? "", alt: alt ?? "" },
      children: [],
    };
  }

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const txt = child.textContent ?? "";
      if (txt.trim()) text = (text ?? "") + txt;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(nodeToBlock(child as Element));
    }
  });

  return {
    id: createId(),
    tag: usedTag,
    text: meta.text ? text : undefined,
    attrs: parseAttrs(node),
    styles: parseStyle(node.getAttribute("style")),
    children,
  };
}

/** Parse full HTML document or fragment into blocks. */
export function parseHtml(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  if (!body) return [];

  const blocks: Block[] = [];
  body.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      blocks.push(nodeToBlock(child as Element));
    }
  });
  return blocks;
}
