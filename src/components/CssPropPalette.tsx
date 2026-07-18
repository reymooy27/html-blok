import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "../store";

const CSS_PROPS: string[] = [
  "color",
  "background-color",
  "background",
  "font-size",
  "font-family",
  "font-weight",
  "text-align",
  "line-height",
  "letter-spacing",
  "text-decoration",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border",
  "border-width",
  "border-style",
  "border-color",
  "border-radius",
  "width",
  "height",
  "max-width",
  "min-width",
  "display",
  "flex",
  "flex-direction",
  "justify-content",
  "align-items",
  "gap",
  "box-shadow",
  "opacity",
  "text-transform",
  "cursor",
  "overflow",
  "position",
  "top",
  "right",
  "bottom",
  "left",
];

export function CssPropPalette() {
  const classStyles = useStore((s) => s.classStyles);
  const hasClass = Object.keys(classStyles).length > 0;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CSS_PROPS;
    return CSS_PROPS.filter((p) => p.toLowerCase().includes(q));
  }, [query]);

  return (
    <aside className="thin-scroll flex h-full w-56 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-slate-50">
      <div className="space-y-2 border-b border-slate-200 p-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Properti CSS
        </h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari properti…"
            className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
          />
        </div>
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-xs leading-snug text-slate-400">
          Seret properti ke kolom kelas di sebelah kanan.
        </p>
        {!hasClass && (
          <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-600">
            Buat kelas dulu di panel kanan, lalu seret properti ke sini.
          </p>
        )}
        {filtered.map((p) => (
          <div
            key={p}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/css-prop", p);
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="cursor-grab rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-xs text-slate-600 shadow-sm active:cursor-grabbing hover:border-indigo-300"
            title="Seret ke kolom kelas"
          >
            {p}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-1 text-sm text-slate-400">Tidak ditemukan.</p>
        )}
      </div>
    </aside>
  );
}
