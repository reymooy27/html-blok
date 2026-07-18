import { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { useStore } from "../store";
import { serializeHtml } from "../lib/serialize";
import { parseHtml } from "../lib/parseHtml";
import { html as beautifyHtml } from "js-beautify";

function pretty(code: string): string {
  return beautifyHtml(code, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: false,
    extra_liners: [],
  });
}

export function CodeEditor() {
  const load = useStore((s) => s.load);
  const initial = useMemo(
    () =>
      pretty(
        serializeHtml(
          useStore.getState().blocks,
          useStore.getState().classStyles,
        ),
      ),
    [],
  );
  const [code, setCode] = useState(initial);
  const [status, setStatus] = useState<"ok" | "invalid">("ok");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNext = useRef(false);

  // Auto-apply ke canvas (debounce) saat user mengetik.
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const { blocks, classStyles } = parseHtml(code);
      if (blocks.length) {
        skipNext.current = true; // jangan biarkan subscribe menimpa kode kita
        load(blocks, classStyles);
        setStatus("ok");
      } else {
        setStatus("invalid");
      }
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [code, load]);

  // Jika canvas berubah dari luar editor (mis. drag di Susun), sinkron balik.
  useEffect(() => {
    const unsub = useStore.subscribe((state, prev) => {
      if (skipNext.current) {
        skipNext.current = false;
        return;
      }
      if (state.blocks === prev.blocks && state.classStyles === prev.classStyles)
        return;
      setCode(pretty(serializeHtml(state.blocks, state.classStyles)));
      setStatus("ok");
    });
    return unsub;
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-1.5">
        <span className="text-sm font-semibold text-slate-500">
          {"</>"} Kode HTML
        </span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
            status === "ok"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {status === "ok" ? "Auto • tersimpan" : "HTML belum valid"}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <CodeMirror
          value={code}
          height="100%"
          theme="dark"
          extensions={[html(), keymap.of([indentWithTab])]}
          onChange={(val) => setCode(val)}
          className="h-full overflow-auto text-sm"
        />
      </div>
    </div>
  );
}
