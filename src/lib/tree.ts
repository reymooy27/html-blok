import type { Block } from "../types";

export type Found = {
  block: Block;
  parent: Block[]; // array yang berisi block ini
  index: number;
};

/** Cari block beserta array pembawanya (root atau children milik parent). */
export function findBlock(
  root: Block[],
  id: string,
  parent: Block[] = root,
): Found | null {
  for (let i = 0; i < parent.length; i++) {
    const block = parent[i];
    if (block.id === id) return { block, parent, index: i };
    const found = findBlock(root, id, block.children);
    if (found) return found;
  }
  return null;
}

/** Hapus block dari pohon, kembalikan pohon baru (immutable). */
export function removeFromTree(root: Block[], id: string): Block[] {
  return root
    .filter((b) => b.id !== id)
    .map((b) => ({ ...b, children: removeFromTree(b.children, id) }));
}

/** Sisipkan block ke dalam parent (atau root) pada index tertentu. */
export function insertIntoTree(
  root: Block[],
  block: Block,
  parentId: string | null,
  index: number,
): Block[] {
  if (parentId === null) {
    const next = [...root];
    next.splice(clamp(index, next.length), 0, block);
    return next;
  }
  return root.map((b) => {
    if (b.id === parentId) {
      const children = [...b.children];
      children.splice(clamp(index, children.length), 0, block);
      return { ...b, children };
    }
    return { ...b, children: insertIntoTree(b.children, block, parentId, index) };
  });
}

export function clamp(value: number, max: number): number {
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function cloneBlock(block: Block, withNewIds = true): Block {
  const id = withNewIds ? createId() : block.id;
  return {
    id,
    tag: block.tag,
    text: block.text,
    attrs: block.attrs ? { ...block.attrs } : undefined,
    styles: block.styles ? { ...block.styles } : undefined,
    children: block.children.map((c) => cloneBlock(c, withNewIds)),
  };
}
