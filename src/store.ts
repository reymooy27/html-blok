import { create } from "zustand";
import type { Block, BlockAttrs, CssStyle, HtmlTag } from "./types";
import {
  cloneBlock,
  createId,
  findBlock,
  insertIntoTree,
  removeFromTree,
} from "./lib/tree";
import { TAG_META } from "./lib/tags";

type State = {
  blocks: Block[];
  selectedId: string | null;
  past: Block[][];
  future: Block[][];
  lastCoalesce: string | null;
};

type Actions = {
  addBlock: (tag: HtmlTag, parentId: string | null, index: number) => void;
  moveBlock: (id: string, parentId: string | null, index: number) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateText: (id: string, text: string) => void;
  updateAttr: (id: string, key: keyof BlockAttrs, value: string) => void;
  updateStyle: (
    id: string,
    key: keyof CssStyle,
    value: CssStyle[keyof CssStyle],
  ) => void;
  select: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  load: (blocks: Block[]) => void;
};

type Store = State & Actions;

function makeBlock(tag: HtmlTag): Block {
  const meta = TAG_META[tag];
  return {
    id: createId(),
    tag,
    text: meta.text ? "" : undefined,
    attrs: meta.tag === "img" ? { src: "", alt: "" } : undefined,
    children: [],
  };
}

function updateInTree(
  root: Block[],
  id: string,
  updater: (b: Block) => Block,
): Block[] {
  return root.map((b) => {
    if (b.id === id) return updater(b);
    return { ...b, children: updateInTree(b.children, id, updater) };
  });
}

function isDescendant(
  root: Block[],
  ancestorId: string,
  maybeDescId: string,
): boolean {
  const found = findBlock(root, ancestorId);
  if (!found) return false;
  let result = false;
  const walk = (list: Block[]) => {
    for (const c of list) {
      if (c.id === maybeDescId) result = true;
      walk(c.children);
    }
  };
  walk(found.block.children);
  return result;
}

const MAX_HISTORY = 50;

export const useStore = create<Store>((set, get) => {
  /**
   * Terapkan pohon baru ke state.
   * @param coalesceKey jika sama dengan aksi sebelumnya (mis. mengetik di
   *   field yang sama), snapshot history TIDAK ditambah → 1 langkah undo.
   */
  const push = (next: Block[], coalesceKey: string | null = null) => {
    const { blocks, past, lastCoalesce } = get();
    if (coalesceKey && lastCoalesce === coalesceKey) {
      set({ blocks: next, lastCoalesce });
      return;
    }
    set({
      blocks: next,
      past: [...past, blocks].slice(-MAX_HISTORY),
      future: [],
      lastCoalesce: coalesceKey,
    });
  };

  // aksi struktural: selalu reset coalesce
  const structural = (next: Block[], selectId: string | null = null) => {
    const { blocks, past } = get();
    set({
      blocks: next,
      past: [...past, blocks].slice(-MAX_HISTORY),
      future: [],
      lastCoalesce: null,
      ...(selectId !== null ? { selectedId: selectId } : {}),
    });
  };

  return {
    blocks: [],
    selectedId: null,
    past: [],
    future: [],
    lastCoalesce: null,

    addBlock: (tag, parentId, index) => {
      const block = makeBlock(tag);
      const next = insertIntoTree(get().blocks, block, parentId, index);
      structural(next, block.id);
    },

    moveBlock: (id, parentId, index) => {
      if (id === parentId) return;
      if (parentId && isDescendant(get().blocks, id, parentId)) return;
      const found = findBlock(get().blocks, id);
      if (!found) return;
      const moved = found.block;
      const without = removeFromTree(get().blocks, id);
      let adj = index;
      if (parentId === null) {
        const oldRootIdx = get().blocks.findIndex((b) => b.id === id);
        if (oldRootIdx !== -1 && oldRootIdx < index) adj = index - 1;
      } else {
        const oldParent = findBlock(get().blocks, parentId);
        if (oldParent) {
          const oldIdx = oldParent.parent.findIndex((b) => b.id === id);
          if (oldIdx !== -1 && oldIdx < index) adj = index - 1;
        }
      }
      const next = insertIntoTree(without, moved, parentId, adj);
      structural(next);
    },

    removeBlock: (id) => {
      const next = removeFromTree(get().blocks, id);
      structural(next);
      if (get().selectedId === id) set({ selectedId: null });
    },

    duplicateBlock: (id) => {
      const found = findBlock(get().blocks, id);
      if (!found) return;
      const copy = cloneBlock(found.block);
      const parentId =
        found.parent === get().blocks
          ? null
          : found.parent[found.index]?.id ?? null;
      const next = insertIntoTree(get().blocks, copy, parentId, found.index + 1);
      structural(next, copy.id);
    },

    updateText: (id, text) =>
      push(
        updateInTree(get().blocks, id, (b) => ({ ...b, text })),
        `text:${id}`,
      ),

    updateAttr: (id, key, value) =>
      push(
        updateInTree(get().blocks, id, (b) => ({
          ...b,
          attrs: { ...b.attrs, [key]: value },
        })),
        `attr:${id}:${key}`,
      ),

    updateStyle: (id, key, value) =>
      push(
        updateInTree(get().blocks, id, (b) => ({
          ...b,
          styles: { ...b.styles, [key]: value },
        })),
        `style:${id}:${key}`,
      ),

    select: (id) => set({ selectedId: id }),

    undo: () => {
      const { past, future, blocks } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      set({
        blocks: previous,
        past: past.slice(0, -1),
        future: [blocks, ...future].slice(0, MAX_HISTORY),
        lastCoalesce: null,
      });
    },

    redo: () => {
      const { past, future, blocks } = get();
      if (future.length === 0) return;
      const next = future[0];
      set({
        blocks: next,
        past: [...past, blocks].slice(-MAX_HISTORY),
        future: future.slice(1),
        lastCoalesce: null,
      });
    },

    reset: () => {
      const { blocks } = get();
      if (blocks.length === 0) return;
      structural([]);
      set({ selectedId: null });
    },

    load: (blocks) => {
      set({ blocks, selectedId: null, past: [], future: [], lastCoalesce: null });
    },
  };
});
