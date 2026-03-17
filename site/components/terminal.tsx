export function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
        </div>
        <span
          className="text-[10px] text-zinc-700"
          style={{ fontFamily: "var(--font-jet)" }}
        >
          zsh
        </span>
      </div>
      <div
        className="bg-[#0c0c0c] p-5 text-[13px] leading-relaxed"
        style={{ fontFamily: "var(--font-jet)" }}
      >
        {children}
      </div>
    </div>
  );
}
