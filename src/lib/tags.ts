import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  MousePointerClick,
  Link as LinkIcon,
  Image,
  Square,
  List,
  ListOrdered,
  Box,
  type LucideIcon,
} from "lucide-react";
import type { HtmlTag } from "../types";

export type TagMeta = {
  tag: HtmlTag;
  label: string; // nama ramah anak (Bahasa Indonesia)
  hint: string;
  icon: LucideIcon;
  /** Bisa diisi block lain di dalamnya */
  container: boolean;
  /** Menampung teks yang bisa diketik anak */
  text: boolean;
  /** Tag self-closing (tidak punya children/teks) */
  void?: boolean;
  /** Atribut yang bisa diedit */
  attrs?: Array<"src" | "alt" | "href">;
  /** Warna aksen block di canvas */
  color: string;
};

export const TAG_CATALOG: TagMeta[] = [
  {
    tag: "h1",
    label: "Judul Besar",
    hint: "Heading paling besar",
    icon: Heading1,
    container: false,
    text: true,
    color: "#ef4444",
  },
  {
    tag: "h2",
    label: "Judul",
    hint: "Heading sedang",
    icon: Heading2,
    container: false,
    text: true,
    color: "#f97316",
  },
  {
    tag: "h3",
    label: "Sub Judul",
    hint: "Heading kecil",
    icon: Heading3,
    container: false,
    text: true,
    color: "#f59e0b",
  },
  {
    tag: "p",
    label: "Paragraf",
    hint: "Teks panjang",
    icon: Type,
    container: false,
    text: true,
    color: "#3b82f6",
  },
  {
    tag: "span",
    label: "Potongan Teks",
    hint: "Teks pendek di dalam baris",
    icon: Type,
    container: false,
    text: true,
    color: "#0ea5e9",
  },
  {
    tag: "button",
    label: "Tombol",
    hint: "Bisa diklik",
    icon: MousePointerClick,
    container: false,
    text: true,
    color: "#22c55e",
  },
  {
    tag: "a",
    label: "Tautan",
    hint: "Link ke halaman lain",
    icon: LinkIcon,
    container: false,
    text: true,
    attrs: ["href"],
    color: "#14b8a6",
  },
  {
    tag: "img",
    label: "Gambar",
    hint: "Foto / gambar",
    icon: Image,
    container: false,
    text: false,
    void: true,
    attrs: ["src", "alt"],
    color: "#a855f7",
  },
  {
    tag: "div",
    label: "Kotak",
    hint: "Wadah untuk menumpuk block",
    icon: Square,
    container: true,
    text: false,
    color: "#6366f1",
  },
  {
    tag: "section",
    label: "Bagian",
    hint: "Kelompok besar konten",
    icon: Box,
    container: true,
    text: false,
    color: "#8b5cf6",
  },
  {
    tag: "ul",
    label: "Daftar",
    hint: "Berisi Item daftar",
    icon: List,
    container: true,
    text: false,
    color: "#ec4899",
  },
  {
    tag: "li",
    label: "Item Daftar",
    hint: "Satu baris dalam daftar",
    icon: ListOrdered,
    container: false,
    text: true,
    color: "#d946ef",
  },
];

export const TAG_META: Record<HtmlTag, TagMeta> = TAG_CATALOG.reduce(
  (acc, meta) => {
    acc[meta.tag] = meta;
    return acc;
  },
  {} as Record<HtmlTag, TagMeta>,
);

export function isContainer(tag: HtmlTag): boolean {
  return TAG_META[tag].container;
}
