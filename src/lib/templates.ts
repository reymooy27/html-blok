import type { Block } from "../types";
import { createId } from "./tree";
import { TAG_META } from "./tags";

function b(
  tag: Block["tag"],
  extra: Partial<Block> = {},
): Block {
  const meta = TAG_META[tag];
  return {
    id: createId(),
    tag,
    text: meta.text ? "" : undefined,
    children: [],
    ...extra,
  };
}

export type Template = {
  id: string;
  name: string;
  build: () => Block[];
};

export const TEMPLATES: Template[] = [
  {
    id: "kosong",
    name: "Lembar Kosong",
    build: () => [],
  },
  {
    id: "kartu",
    name: "Kartu Profil",
    build: () => [
      b("div", {
        styles: { padding: 24, borderRadius: 16, backgroundColor: "#eef2ff" },
        children: [
          b("img", {
            attrs: {
              src: "https://placehold.co/120x120",
              alt: "Foto profil",
            },
          }),
          b("h2", { text: "Nama Saya" }),
          b("p", { text: "Halo! Ini kartu profil buatanku." }),
          b("button", { text: "Kenali Aku" }),
        ],
      }),
    ],
  },
  {
    id: "undangan",
    name: "Undangan Pesta",
    build: () => [
      b("section", {
        styles: {
          padding: 32,
          borderRadius: 12,
          backgroundColor: "#fef9c3",
          textAlign: "center",
        },
        children: [
          b("h1", { text: "🎉 Ayo ke Pestaku!" }),
          b("p", { text: "Sabtu ini, jam 3 sore di rumahku." }),
          b("button", { text: "Hadir" }),
        ],
      }),
    ],
  },
  {
    id: "daftar",
    name: "Daftar Belanja",
    build: () => [
      b("h2", { text: "Daftar Belanja" }),
      b("ul", {
        children: [
          b("li", { text: "Apel" }),
          b("li", { text: "Susu" }),
          b("li", { text: "Roti" }),
        ],
      }),
    ],
  },
];
