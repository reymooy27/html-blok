import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import type { ClassStyle } from "../types";
import { useStore } from "../store";

const CSS_TO_CAMEL: Record<string, string> = {};
function toCamel(prop: string): string {
  if (prop.startsWith("--")) return prop; // CSS custom property
  if (CSS_TO_CAMEL[prop]) return CSS_TO_CAMEL[prop];
  const c = prop.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
  CSS_TO_CAMEL[prop] = c;
  return c;
}

function ClassCard({
  name,
  style,
  collapsed,
  setCollapsed,
  onDropProp,
}: {
  name: string;
  style: ClassStyle;
  collapsed: Record<string, boolean>;
  setCollapsed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onDropProp: (name: string, e: React.DragEvent) => void;
}) {
  const updateClassStyle = useStore((s) => s.updateClassStyle);
  const removeClassProp = useStore((s) => s.removeClassProp);
  const renameClassStyle = useStore((s) => s.renameClassStyle);
  const removeClassStyle = useStore((s) => s.removeClassStyle);

  const [draft, setDraft] = useState(name);
  const open = collapsed[name] !== true;
  const entries = Object.entries(style);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={() => setCollapsed((c) => ({ ...c, [name]: open }))}
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          title={open ? "Tutup" : "Buka"}
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <span className="font-mono text-sm font-semibold text-slate-400">.</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft !== name) renameClassStyle(name, draft);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="min-w-0 flex-1 rounded-md border border-transparent px-1 py-1 font-mono text-sm font-semibold text-slate-700 outline-none hover:border-slate-200 focus:border-indigo-400"
        />
        <button
          onClick={() => removeClassStyle(name)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
          title="Hapus kelas"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-slate-100 p-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropProp(name, e)}
            className="min-h-[64px] space-y-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-3"
          >
            {entries.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">
                Seret properti CSS ke sini
              </p>
            ) : (
              entries.map(([prop, value]) => (
                <div
                  key={prop}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5"
                >
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {prop}:
                  </span>
                  <input
                    value={value}
                    onChange={(e) =>
                      updateClassStyle(name, prop, e.target.value)
                    }
                    placeholder="nilai, mis. 12px / red"
                    className="min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 font-mono text-xs text-slate-700 outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={() => removeClassProp(name, prop)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    title="Hapus properti"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function StyleSheet() {
  const classStyles = useStore((s) => s.classStyles);
  const addClassProp = useStore((s) => s.addClassProp);
  const updateClassStyle = useStore((s) => s.updateClassStyle);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const names = Object.keys(classStyles);

  const addClass = () => {
    let i = names.length + 1;
    let name = `kelas${i}`;
    while (classStyles[name]) {
      i += 1;
      name = `kelas${i}`;
    }
    addClassProp(name, "background-color");
    updateClassStyle(name, "background-color", "#eef2ff");
  };

  const onDropProp = (name: string, e: React.DragEvent) => {
    e.preventDefault();
    const prop = e.dataTransfer.getData("text/css-prop");
    if (prop) addClassProp(name, prop);
  };

  return (
    <main className="h-full overflow-y-auto bg-slate-100 p-4">
      <div className="mx-auto max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-700">🎨 Gaya Kelas</h2>
            <button
              onClick={addClass}
              className="ml-auto flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" /> Tambah Kelas
            </button>
          </div>
          <p className="text-sm text-slate-400">
            Seret properti CSS dari kiri ke kolom kelas, lalu ketik nilainya.
            Pakai nama kelas di panel Properti (Nama Kelas).
          </p>

          {names.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-400">
              Belum ada kelas. Klik “Tambah Kelas” untuk memulai.
            </p>
          ) : (
            names.map((name) => (
              <ClassCard
                key={name}
                name={name}
                style={classStyles[name]}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                onDropProp={onDropProp}
              />
            ))
          )}
        </div>
      </main>
  );
}
