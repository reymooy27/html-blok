import { useMemo, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Search } from "lucide-react";
import {
  TAG_CATALOG_CATEGORIZED,
  CATEGORY_ORDER,
  type TagMeta,
} from "../lib/tags";

function PaletteItem({ meta }: { meta: TagMeta }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${meta.tag}`,
    data: { kind: "palette", tag: meta.tag },
  });
  const Icon = meta.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex w-full items-center gap-2 rounded-xl border-l-4 bg-white px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isDragging ? "opacity-40" : ""
      }`}
      style={{ borderLeftColor: meta.color }}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: meta.color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-700">
          {meta.label}
        </span>
        <span className="block truncate font-mono text-[11px] text-slate-400">
          &lt;{meta.tag}&gt;
        </span>
      </span>
    </button>
  );
}

export function Palette() {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = TAG_CATALOG_CATEGORIZED.filter((m) =>
      q
        ? m.tag.includes(q) ||
          m.label.toLowerCase().includes(q) ||
          m.hint.toLowerCase().includes(q)
        : true,
    );
    return CATEGORY_ORDER.map((cat) => ({
      cat,
      items: filtered.filter((m) => m.category === cat),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-700">🧱 Block</h2>
        <p className="text-xs text-slate-400">Seret ke kanvas</p>
      </div>
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari block…"
            className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
          />
        </div>
      </div>
      <div className="thin-scroll flex-1 space-y-4 overflow-y-auto p-3">
        {grouped.map((g) => (
          <div key={g.cat} className="space-y-2">
            <p className="px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {g.cat}
            </p>
            {g.items.map((meta) => (
              <PaletteItem key={meta.tag} meta={meta} />
            ))}
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="px-1 text-sm text-slate-400">Tidak ditemukan.</p>
        )}
      </div>
    </aside>
  );
}
