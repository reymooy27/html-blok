import { useDroppable } from "@dnd-kit/core";

type ParentRef = { parentId: string | null };

function parentKey(parentId: string | null): string {
  return parentId ?? "root";
}

/** Garis drop antar sibling (untuk urutan). */
export function Gap({
  parentId,
  index,
}: ParentRef & { index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `gap:${parentKey(parentId)}:${index}`,
    data: { kind: "gap", parentId, index },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-2 rounded-full transition-all ${
        isOver ? "h-6 bg-indigo-400/70" : "bg-transparent hover:bg-indigo-200/40"
      }`}
    >
      {isOver && <div className="h-full w-full rounded-full" />}
    </div>
  );
}

/** Zona drop untuk container kosong. */
export function EmptyDrop({ parentId }: ParentRef) {
  const { setNodeRef, isOver } = useDroppable({
    id: `inside:${parentKey(parentId)}`,
    data: { kind: "inside", parentId },
  });

  return (
    <div
      ref={setNodeRef}
      className={`my-1 flex min-h-[44px] items-center justify-center rounded-lg border-2 border-dashed text-sm transition ${
        isOver
          ? "border-indigo-400 bg-indigo-50 text-indigo-600"
          : "border-slate-300 text-slate-400"
      }`}
    >
      {isOver ? "Taruh di sini" : "Seret block ke sini"}
    </div>
  );
}
