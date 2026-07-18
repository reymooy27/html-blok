import type { Block, CssStyle, BlockAttrs, ClassStyle } from "../types";

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
  if (styles.width) parts.push(`width:${styles.width}px`);
  if (styles.height) parts.push(`height:${styles.height}px`);
  if (styles.margin) parts.push(`margin:${styles.margin}px`);
  return parts.join(";");
}

function attrsToHtml(block: Block): string {
  const out: string[] = [];
  const a: BlockAttrs | undefined = block.attrs;
  if (a?.src) out.push(`src="${escapeHtml(a.src)}"`);
  if (a?.alt) out.push(`alt="${escapeHtml(a.alt)}"`);
  if (a?.href) out.push(`href="${escapeHtml(a.href)}"`);
  if (a?.class) out.push(`class="${escapeHtml(a.class)}"`);
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

function classStylesToCss(classStyles: Record<string, Record<string, string>>): string {
  const rules = Object.entries(classStyles)
    .map(([name, props]) => {
      const decl = Object.entries(props)
        .filter(([, v]) => v.trim() !== "")
        .map(([p, v]) => `  ${p}: ${v};`)
        .join("\n");
      if (!decl) return "";
      return `.${name} {\n${decl}\n}`;
    })
    .filter(Boolean)
    .join("\n");
  return rules;
}

export function serializeHtml(
  blocks: Block[],
  classStyles: Record<string, ClassStyle> = {},
): string {
  const body = blocks.map(blockToHtml).join("\n");
  const custom = classStylesToCss(classStyles);
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { font-family: system-ui, sans-serif; padding: 16px; line-height: 1.5; }
  img { max-width: 100%; }
${custom}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
