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

export function Properties() {
  const blocks = useStore((s) => s.blocks);
  const selectedId = useStore((s) => s.selectedId);
  const updateText = useStore((s) => s.updateText);
  const updateAttr = useStore((s) => s.updateAttr);

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
    </aside>
  );
}
