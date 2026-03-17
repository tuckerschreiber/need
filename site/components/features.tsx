const features = [
  {
    label: "SEARCH",
    title: "Semantic, not keyword",
    stat: "2,847",
    unit: "indexed tools",
    body: "Vector embeddings understand intent. Find the right tool even when you don't know its name.",
  },
  {
    label: "PROTOCOL",
    title: "MCP-native",
    stat: "0",
    unit: "config needed",
    body: "First-class MCP server. Your AI agent discovers and installs tools without human intervention.",
  },
  {
    label: "REGISTRY",
    title: "Curated by hand",
    stat: "100%",
    unit: "human-vetted",
    body: "No scraped package dumps. Every tool reviewed for quality, maintenance status, and documentation.",
  },
  {
    label: "SOURCE",
    title: "Fully open",
    stat: "MIT",
    unit: "licensed",
    body: "Inspect it. Fork it. Self-host it. Submit tools. The registry belongs to the community.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6 sm:px-10">
      <div className="sep mb-32" />
      <div className="mx-auto max-w-7xl">
        <p
          className="text-[11px] text-stone-400 tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-jet)" }}
        >
          capabilities
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight gradient-text-subtle mb-20">
          Built for the agent era
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200">
          {features.map((f) => (
            <div key={f.label} className="bg-[#fafaf9] p-6 group">
              <div
                className="text-[9px] text-stone-300 tracking-[0.3em] mb-6"
                style={{ fontFamily: "var(--font-jet)" }}
              >
                {f.label}
              </div>
              <div className="mb-4">
                <span
                  className="text-2xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors"
                  style={{ fontFamily: "var(--font-jet)" }}
                >
                  {f.stat}
                </span>
                <span
                  className="block text-[10px] text-stone-400 mt-0.5"
                  style={{ fontFamily: "var(--font-jet)" }}
                >
                  {f.unit}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-stone-700 mb-2">{f.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
