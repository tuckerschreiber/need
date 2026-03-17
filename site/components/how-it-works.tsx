export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 sm:px-10">
      <div className="sep mb-32" />
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p
              className="text-[11px] text-stone-400 tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-jet)" }}
            >
              how it works
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight gradient-text-subtle">
              Describe it.
              <br />
              Find it.
              <br />
              Use it.
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Describe the problem",
                body: "\"convert pdf to markdown\", \"lint dockerfile\", \"resize images in batch\". Plain English, not package names. The semantic engine handles the rest.",
              },
              {
                step: "02",
                title: "Get ranked matches",
                body: "Vector similarity against every tool in the registry. Results scored by relevance, usage count, and reliability. Best match first — not most popular.",
              },
              {
                step: "03",
                title: "Install or connect",
                body: "Every result includes the exact install command. Or run need as an MCP server — Claude, Cursor, or any compatible agent discovers tools autonomously.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`flex gap-6 p-6 ${i !== 2 ? "border-b border-stone-200" : ""}`}
              >
                <span
                  className="text-amber-500/40 text-xs mt-1 shrink-0"
                  style={{ fontFamily: "var(--font-jet)" }}
                >
                  {s.step}
                </span>
                <div>
                  <h3 className="text-stone-900 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-stone-400 leading-relaxed max-w-md">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
