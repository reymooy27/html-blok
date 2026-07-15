import type { CssStyle } from "../types";
import { TAG_META } from "../lib/tags";
import { useStore } from "../store";
import { findBlock } from "../lib/tree";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400";

const STYLE_FIELDS: Array<{
  key: keyof CssStyle;
  label: string;
  type: "color" | "range" | "select";
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
}> = [
  { key: "color", label: "Warna Teks", type: "color" },
  { key: "backgroundColor", label: "Warna Latar", type: "color" },
  {
    key: "fontSize",
    label: "Ukuran Huruf",
    type: "range",
    min: 8,
    max: 72,
    step: 1,
  },
  {
    key: "padding",
    label: "Jarak Dalam",
    type: "range",
    min: 0,
    max: 48,
    step: 1,
  },
  {
    key: "borderRadius",
    label: "Sudut Membulat",
    type: "range",
    min: 0,
    max: 40,
    step: 1,
  },
  {
    key: "borderWidth",
    label: "Ketebalan Garis Tepi",
    type: "range",
    min: 0,
    max: 12,
    step: 1,
  },
  { key: "borderColor", label: "Warna Garis Tepi", type: "color" },
  {
    key: "textAlign",
    label: "Rata Teks",
    type: "select",
    options: [
      { value: "left", label: "Kiri" },
      { value: "center", label: "Tengah" },
      { value: "right", label: "Kanan" },
    ],
  },
];

export function Properties() {
  const blocks = useStore((s) => s.blocks);
  const selectedId = useStore((s) => s.selectedId);
  const updateText = useStore((s) => s.updateText);
  const updateAttr = useStore((s) => s.updateAttr);
  const updateStyle = useStore((s) => s.updateStyle);

  const found = selectedId ? findBlock(blocks, selectedId) : null;
  const block = found?.block;

  if (!block) {
    return (
      <aside className="w-64 shrink-0 border-l border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-700">🎨 Properti</h2>
        <p className="mt-4 text-sm text-slate-400">
          Pilih sebuah block untuk mengubah teks & gayanya.
        </p>
      </aside>
    );
  }

  const meta = TAG_META[block.tag];
  const styles = block.styles ?? {};

  return (
    <aside className="thin-scroll w-64 shrink-0 space-y-3 overflow-y-auto border-l border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-sm font-bold text-slate-700">🎨 Properti</h2>
        <p className="font-mono text-xs text-slate-400">&lt;{block.tag}&gt;</p>
      </div>

      {meta.text && (
        <Field label="Teks">
          <textarea
            value={block.text ?? ""}
            onChange={(e) => updateText(block.id, e.target.value)}
            rows={3}
            placeholder="Ketik di sini…"
            className={`${inputCls} resize-none`}
          />
        </Field>
      )}

      {meta.attrs?.includes("href") && (
        <Field label="Tautan (href)">
          <input
            value={block.attrs?.href ?? ""}
            onChange={(e) => updateAttr(block.id, "href", e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>
      )}
      {meta.attrs?.includes("src") && (
        <Field label="Sumber Gambar (src)">
          <input
            value={block.attrs?.src ?? ""}
            onChange={(e) => updateAttr(block.id, "src", e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>
      )}
      {meta.attrs?.includes("alt") && (
        <Field label="Teks Pengganti (alt)">
          <input
            value={block.attrs?.alt ?? ""}
            onChange={(e) => updateAttr(block.id, "alt", e.target.value)}
            placeholder="Deskripsi gambar"
            className={inputCls}
          />
        </Field>
      )}

      <div className="border-t border-slate-100 pt-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Gaya CSS
        </p>
        <div className="space-y-3">
          {STYLE_FIELDS.map((f) => {
            const value = styles[f.key];
            if (f.type === "color") {
              return (
                <Field key={f.key} label={f.label}>
                  <input
                    type="color"
                    value={typeof value === "string" ? value : "#000000"}
                    onChange={(e) =>
                      updateStyle(block.id, f.key, e.target.value)
                    }
                    className="h-9 w-full cursor-pointer rounded-lg border border-slate-200"
                  />
                </Field>
              );
            }
            if (f.type === "range") {
              return (
                <Field key={f.key} label={`${f.label}: ${value ?? 0}`}>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={typeof value === "number" ? value : 0}
                    onChange={(e) =>
                      updateStyle(block.id, f.key, Number(e.target.value))
                    }
                    className="w-full accent-indigo-500"
                  />
                </Field>
              );
            }
            return (
              <Field key={f.key} label={f.label}>
                <select
                  value={typeof value === "string" ? value : "left"}
                  onChange={(e) =>
                    updateStyle(block.id, f.key, e.target.value)
                  }
                  className={inputCls}
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
