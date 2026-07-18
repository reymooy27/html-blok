import { useStore } from "../store";
import { BlockNode } from "./BlockNode";
import { Gap, EmptyDrop } from "./DropZones";

export function Canvas() {
  const blocks = useStore((s) => s.blocks);
  const select = useStore((s) => s.select);

  return (
    <div
      className="thin-scroll h-full min-h-0 flex-1 overflow-y-auto bg-slate-100 p-4 pb-24"
      onClick={() => select(null)}
    >
      <div
        className="mx-auto max-w-2xl space-y-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        {blocks.length === 0 ? (
          <EmptyDrop parentId={null} />
        ) : (
          <>
            {blocks.map((block, i) => (
              <div key={block.id}>
                <Gap parentId={null} index={i} />
                <BlockNode block={block} />
              </div>
            ))}
            <Gap parentId={null} index={blocks.length} />
          </>
        )}
      </div>
    </div>
  );
}
