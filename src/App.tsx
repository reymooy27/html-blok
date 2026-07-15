import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Toolbar } from "./components/Toolbar";
import { Palette } from "./components/Palette";
import { Canvas } from "./components/Canvas";
import { Properties } from "./components/Properties";
import { Preview } from "./components/Preview";
import { useStore } from "./store";
import { TAG_META, type TagMeta } from "./lib/tags";
import { findBlock } from "./lib/tree";
import type { HtmlTag } from "./types";

type Active =
  | { kind: "palette"; tag: HtmlTag }
  | { kind: "block"; tag: HtmlTag }
  | null;

function fromData(
  data: Record<string, unknown> | undefined,
  blocks: ReturnType<typeof useStore.getState>["blocks"],
): Active {
  if (!data) return null;
  if (data.kind === "palette") {
    return { kind: "palette", tag: data.tag as HtmlTag };
  }
  if (data.kind === "block") {
    const id = data.id as string;
    const found = findBlock(blocks, id);
    if (found) return { kind: "block", tag: found.block.tag };
  }
  return null;
}

export default function App() {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [active, setActive] = useState<Active>(null);

  const addBlock = useStore((s) => s.addBlock);
  const moveBlock = useStore((s) => s.moveBlock);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const editable =
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.isContentEditable;
      if (editable) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const onDragStart = (e: DragStartEvent) => {
    setActive(fromData(e.active.data.current, useStore.getState().blocks));
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);
    const over = e.over;
    if (!over) return;
    const data = e.active.data.current as
      | { kind: "palette"; tag: HtmlTag }
      | { kind: "block"; id: string }
      | undefined;
    const overData = over.data.current as
      | { kind: "inside"; parentId: string | null }
      | { kind: "gap"; parentId: string | null; index: number }
      | undefined;
    if (!data || !overData) return;

    const resolve = (pid: string | null) => (pid === "root" ? null : pid);

    if (overData.kind === "inside") {
      const parentId = resolve(overData.parentId);
      if (data.kind === "palette") addBlock(data.tag, parentId, Number.MAX_SAFE_INTEGER);
      else moveBlock(data.id, parentId, Number.MAX_SAFE_INTEGER);
    } else {
      const parentId = resolve(overData.parentId);
      const index = overData.index;
      if (data.kind === "palette") addBlock(data.tag, parentId, index);
      else moveBlock(data.id, parentId, index);
    }
  };

  const activeMeta: TagMeta | null = active ? TAG_META[active.tag] : null;

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          const p = pointerWithin(args);
          return p.length ? p : rectIntersection(args);
        }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActive(null)}
      >
        <div className="flex min-h-0 flex-1">
          <Palette />
          <main className="flex min-w-0 flex-1 flex-col">
            <div className="flex gap-1 border-b border-slate-200 bg-white px-3 py-1.5">
              <button
                onClick={() => setTab("edit")}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                  tab === "edit"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                🧩 Susun
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                  tab === "preview"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                👀 Hasil
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {tab === "edit" ? <Canvas /> : <Preview />}
            </div>
          </main>
          <Properties />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeMeta ? (
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-lg"
              style={{ backgroundColor: activeMeta.color }}
            >
              <span className="opacity-80">&lt;{activeMeta.tag}&gt;</span>
              {activeMeta.label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
