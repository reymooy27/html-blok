import { useMemo } from "react";
import { useStore } from "../store";
import { serializeHtml } from "../lib/serialize";

export function Preview() {
  const blocks = useStore((s) => s.blocks);
  const html = useMemo(() => serializeHtml(blocks), [blocks]);

  return (
    <iframe
      title="Pratinjau hasil"
      srcDoc={html}
      sandbox="allow-same-origin"
      className="h-full w-full border-0 bg-white"
    />
  );
}
