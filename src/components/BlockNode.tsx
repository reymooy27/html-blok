import { useDraggable } from "@dnd-kit/core";
import {
  Copy,
  GripVertical,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import type { Block } from "../types";
import { TAG_META } from "../lib/tags";
import { useStore } from "../store";
import { Gap, EmptyDrop } from "./DropZones";

export function BlockNode({ block }: { block: Block }) {
  const meta = TAG_META[block.tag];
  const selectedId = useStore((s) => s.selectedId);
  const select = useStore((s) => s.select);
  const updateText = useStore((s) => s.updateText);
  const removeBlock = useStore((s) => s.removeBlock);
  const duplicateBlock = useStore((s) => s.duplicateBlock);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block:${block.id}`,
    data: { kind: "block", id: block.id },
  });

  const selected = selectedId === block.id;
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        select(block.id);
      }}
      className={`relative rounded-xl border bg-white transition ${
        selected
          ? "border-indigo-500 shadow-md ring-2 ring-indigo-200"
          : "border-slate-200 shadow-sm"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      {/* Header = drag handle */}
      <div
        className="flex items-center gap-1 rounded-t-xl px-2 py-1"
        style={{ backgroundColor: `${meta.color}1a` }}
      >
        <button
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
          title="Seret"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-white"
          style={{ backgroundColor: meta.color }}
        >
          <Icon className="h-3 w-3" />
        </span>
        <code className="font-mono text-xs font-semibold text-slate-600">
          &lt;{block.tag}&gt;
        </code>
        <span className="text-xs text-slate-400">{meta.label}</span>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="rounded p-1 text-slate-400 hover:bg-white hover:text-indigo-600"
            title="Duplikat"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
            className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-600"
            title="Hapus"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-2 pb-2 pt-1">
        {block.tag === "img" ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ImageIcon className="h-4 w-4" />
            <span className="truncate">
              {block.attrs?.src || "belum ada gambar"}
            </span>
          </div>
        ) : meta.container ? (
          block.children.length === 0 ? (
            <EmptyDrop parentId={block.id} />
          ) : (
            <div className="space-y-0.5 border-l-2 border-dashed border-slate-200 pl-3">
              {block.children.map((child, i) => (
                <div key={child.id}>
                  <Gap parentId={block.id} index={i} />
                  <BlockNode block={child} />
                </div>
              ))}
              <Gap parentId={block.id} index={block.children.length} />
            </div>
          )
        ) : meta.text ? (
          selected ? (
            <textarea
              autoFocus
              value={block.text ?? ""}
              onChange={(e) => updateText(block.id, e.target.value)}
              placeholder="Ketik teks di sini…"
              rows={Math.max(1, (block.text ?? "").split("\n").length)}
              className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700 outline-none focus:border-indigo-400"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="min-h-[20px] whitespace-pre-wrap px-2 py-1 text-sm text-slate-700">
              {block.text ? (
                block.text
              ) : (
                <span className="text-slate-300">klik untuk isi teks</span>
              )}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
