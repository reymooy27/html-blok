import { useMemo } from "react";
import { useStore } from "../store";
import { serializeHtml } from "../lib/serialize";

export function Preview() {
  const blocks = useStore((s) => s.blocks);
  const classStyles = useStore((s) => s.classStyles);
  const html = useMemo(
    () => serializeHtml(blocks, classStyles),
    [blocks, classStyles],
  );

  return (
    <iframe
      title="Pratinjau hasil"
      srcDoc={html}
      sandbox="allow-same-origin"
      className="h-full w-full border-0 bg-white"
    />
  );
}
