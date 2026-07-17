export type HtmlTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "nav"
  | "main"
  | "aside"
  | "button"
  | "a"
  | "img"
  | "ul"
  | "ol"
  | "li"
  | "table"
  | "thead"
  | "tbody"
  | "tr"
  | "th"
  | "td"
  | "form"
  | "input"
  | "textarea"
  | "select"
  | "option"
  | "label"
  | "blockquote"
  | "pre"
  | "code"
  | "hr"
  | "br"
  | "strong"
  | "em"
  | "small"
  | "mark"
  | "sub"
  | "sup"
  | "video"
  | "audio"
  | "iframe"
  | "figure"
  | "figcaption"
  | "details"
  | "summary"
  | "dl"
  | "dt"
  | "dd";

export type CssStyle = {
  color?: string;
  backgroundColor?: string;
  fontSize?: number; // px
  padding?: number; // px
  borderRadius?: number; // px
  textAlign?: "left" | "center" | "right";
  borderColor?: string;
  borderWidth?: number; // px
};

export type BlockAttrs = {
  src?: string;
  alt?: string;
  href?: string;
};

export type Block = {
  id: string;
  tag: HtmlTag;
  text?: string;
  attrs?: BlockAttrs;
  styles?: CssStyle;
  children: Block[];
};

export type BlockMap = Record<string, Block>;
