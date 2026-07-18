import { AlignCenter, AlignLeft, AlignRight, X } from "lucide-react";

export const COLOR_SWATCHES: { name: string; value: string }[] = [
  { name: "Merah", value: "#ef4444" },
  { name: "Jingga", value: "#f97316" },
  { name: "Kuning", value: "#eab308" },
  { name: "Hijau", value: "#22c55e" },
  { name: "Biru", value: "#3b82f6" },
  { name: "Ungu", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Hitam", value: "#111827" },
  { name: "Putih", value: "#ffffff" },
];

export function SwatchPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {COLOR_SWATCHES.map((c) => {
          const active = value?.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              key={c.value}
              type="button"
              title={c.name}
              onClick={() => onChange(active ? undefined : c.value)}
              className={`h-7 w-full rounded-md border transition ${
                active
                  ? "ring-2 ring-indigo-500 ring-offset-1"
                  : "border-slate-200"
              }`}
              style={{ backgroundColor: c.value }}
            />
          );
        })}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 hover:text-red-500"
        >
          <X className="h-3 w-3" /> hapus warna
        </button>
      )}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number | undefined) => void;
}) {
  const current = value ?? 0;
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className="font-mono text-xs text-slate-400">
          {value == null ? "auto" : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(v === 0 ? undefined : v);
        }}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}

export function StyleGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-xl bg-slate-50 p-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}

export function AlignButtons({
  value,
  onChange,
}: {
  value?: "left" | "center" | "right";
  onChange: (v: "left" | "center" | "right" | undefined) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        Rata
      </span>
      <div className="flex gap-1">
        {(["left", "center", "right"] as const).map((a) => {
          const active = value === a;
          const Icon =
            a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
          return (
            <button
              key={a}
              type="button"
              onClick={() => onChange(active ? undefined : a)}
              className={`flex flex-1 items-center justify-center rounded-lg border py-1.5 text-slate-600 transition ${
                active
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
              title={a}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
