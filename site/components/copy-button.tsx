"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 border border-stone-200 bg-white px-5 py-3 text-sm transition-all hover:border-stone-300 hover:shadow-sm cursor-pointer"
      style={{ fontFamily: "var(--font-jet)" }}
    >
      <span className="text-amber-500">$</span>
      <span className="text-stone-700">{text}</span>
      <span className="text-xs text-stone-300 group-hover:text-amber-500 transition-colors">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
