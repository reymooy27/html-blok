import type { Block, CssStyle } from "../types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function styleToCss(styles?: CssStyle): string {
  if (!styles) return "";
  const parts: string[] = [];
  if (styles.color) parts.push(`color:${styles.color}`);
  if (styles.backgroundColor)
    parts.push(`background-color:${styles.backgroundColor}`);
  if (styles.fontSize) parts.push(`font-size:${styles.fontSize}px`);
  if (styles.padding) parts.push(`padding:${styles.padding}px`);
  if (styles.borderRadius)
    parts.push(`border-radius:${styles.borderRadius}px`);
  if (styles.textAlign) parts.push(`text-align:${styles.textAlign}`);
  if (styles.borderWidth) {
    const color = styles.borderColor || "#000000";
    parts.push(`border:${styles.borderWidth}px solid ${color}`);
  }
  return parts.join(";");
}

function attrsToHtml(block: Block): string {
  const out: string[] = [];
  if (block.attrs?.src) out.push(`src="${escapeHtml(block.attrs.src)}"`);
  if (block.attrs?.alt) out.push(`alt="${escapeHtml(block.attrs.alt)}"`);
  if (block.attrs?.href) out.push(`href="${escapeHtml(block.attrs.href)}"`);
  const style = styleToCss(block.styles);
  if (style) out.push(`style="${escapeHtml(style)}"`);
  return out.length ? " " + out.join(" ") : "";
}

function blockToHtml(block: Block): string {
  const open = `<${block.tag}${attrsToHtml(block)}>`;
  const close = `</${block.tag}>`;

  if (block.tag === "img") {
    return `<${block.tag}${attrsToHtml(block)}>`;
  }

  const inner = block.children.map(blockToHtml).join("");
  const text = block.text ? escapeHtml(block.text) : "";
  return `${open}${text}${inner}${close}`;
}

export function serializeHtml(blocks: Block[]): string {
  const body = blocks.map(blockToHtml).join("\n");
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { font-family: system-ui, sans-serif; padding: 16px; line-height: 1.5; }
  img { max-width: 100%; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}
