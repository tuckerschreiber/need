import { CopyButton } from "@/components/copy-button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center noise overflow-hidden">
      {/* Ambient glows */}
      <div className="ambient-glow w-[600px] h-[600px] bg-amber-200/30 -top-64 -right-32" />
      <div className="ambient-glow w-[400px] h-[400px] bg-stone-300/20 bottom-0 -left-48" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: text */}
        <div>
          <p
            className="text-[11px] text-stone-400 tracking-[0.3em] uppercase mb-8"
            style={{ fontFamily: "var(--font-jet)" }}
          >
            open-source tool discovery
          </p>

          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.9] tracking-tighter">
            <span className="gradient-text">need</span>
          </h1>

          <p className="mt-6 text-stone-500 text-lg max-w-sm leading-relaxed">
            Your AI agent needs tools. This is how it finds them.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <CopyButton text="npm i -g @needtools/need" />
          </div>

          <div
            className="mt-8 flex gap-8 text-[11px] text-stone-300"
            style={{ fontFamily: "var(--font-jet)" }}
          >
            <span>2,847 tools</span>
            <span>semantic search</span>
            <span>MCP-native</span>
          </div>
        </div>

        {/* Right: terminal */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-br from-amber-100/40 to-transparent rounded-sm" />
          <div className="relative border border-stone-200 bg-stone-900 shadow-2xl shadow-stone-300/50">
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b border-stone-800 text-[10px] text-stone-500"
              style={{ fontFamily: "var(--font-jet)" }}
            >
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-700" />
                <span className="w-2 h-2 rounded-full bg-stone-700" />
                <span className="w-2 h-2 rounded-full bg-stone-700" />
              </div>
              <span className="ml-auto">~</span>
            </div>
            <div
              className="p-5 text-[13px] leading-[1.8] text-stone-300"
              style={{ fontFamily: "var(--font-jet)" }}
            >
              <div>
                <span className="text-amber-400">→</span>{" "}
                <span className="text-stone-200">need search</span>{" "}
                <span className="text-stone-500">&quot;convert pdf to markdown&quot;</span>
              </div>
              <div className="text-stone-600 text-[10px] mt-0.5">
                ⠋ searching 2,847 tools...
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  { name: "marker", cmd: "pip install marker-pdf", match: 97, uses: "2.1k" },
                  { name: "pdf-to-markdown", cmd: "npm i pdf-to-markdown", match: 94, uses: "890" },
                  { name: "pandoc", cmd: "brew install pandoc", match: 92, uses: "15.3k" },
                ].map((t, i) => (
                  <div key={t.name} className="flex items-baseline gap-3">
                    <span className="text-stone-600 text-[11px] w-3 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-medium">{t.name}</span>
                        <div className="flex-1 h-px bg-stone-800" />
                        <span className="text-amber-400/70 text-[11px] tabular-nums">{t.match}%</span>
                      </div>
                      <div className="text-stone-600 text-[11px]">
                        {t.cmd} · {t.uses} uses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-stone-700 text-[10px]">
                3 results · 0.12s
              </div>
              <div className="mt-2">
                <span className="text-amber-400">→</span>
                <span className="ml-1.5 inline-block w-1.5 h-3 bg-amber-400/50 animate-pulse align-middle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
