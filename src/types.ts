export type HtmlTag =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "span"
  | "button"
  | "a"
  | "img"
  | "div"
  | "ul"
  | "li"
  | "section";

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
