import { Redo2, Undo2, Save, Download, Trash2, FileJson } from "lucide-react";
import { useStore } from "../store";
import { TEMPLATES } from "../lib/templates";
import { serializeHtml } from "../lib/serialize";

const SAVE_KEY = "blokhtml:save";

export function Toolbar() {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const reset = useStore((s) => s.reset);
  const load = useStore((s) => s.load);
  const blocks = useStore((s) => s.blocks);
  const canUndo = useStore((s) => s.past.length > 0);
  const canRedo = useStore((s) => s.future.length > 0);

  const onSave = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(blocks));
  };
  const onLoad = () => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      load(JSON.parse(raw));
    } catch {
      /* abaikan */
    }
  };
  const onExport = () => {
    const html = serializeHtml(blocks);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hasil.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const btn =
    "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
      <div className="mr-2 flex items-center gap-2">
        <span className="text-xl">🧱</span>
        <div className="leading-tight">
          <h1 className="text-sm font-extrabold text-slate-800">BlokHTML</h1>
          <p className="text-[11px] text-slate-400">Belajar HTML & CSS</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className={`${btn} hover:bg-slate-100`} onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="h-4 w-4" /> Undo
        </button>
        <button className={`${btn} hover:bg-slate-100`} onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="h-4 w-4" /> Redo
        </button>
      </div>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <select
        defaultValue=""
        onChange={(e) => {
          const t = TEMPLATES.find((x) => x.id === e.target.value);
          if (t) load(t.build());
          e.target.value = "";
        }}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-600 outline-none focus:border-indigo-400"
        title="Template"
      >
        <option value="" disabled>
          📂 Template…
        </option>
        {TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <button className={`${btn} hover:bg-slate-100`} onClick={onSave} title="Simpan ke browser">
        <Save className="h-4 w-4" /> Simpan
      </button>
      <button className={`${btn} hover:bg-slate-100`} onClick={onLoad} title="Muat dari browser">
        <FileJson className="h-4 w-4" /> Muat
      </button>
      <button className={`${btn} hover:bg-slate-100`} onClick={onExport} title="Unduh HTML">
        <Download className="h-4 w-4" /> Export
      </button>
      <button
        className={`${btn} ml-auto text-red-500 hover:bg-red-50`}
        onClick={() => {
          if (confirm("Kosongkan semua block?")) reset();
        }}
        title="Bersihkan"
      >
        <Trash2 className="h-4 w-4" /> Bersih
      </button>
    </header>
  );
}
