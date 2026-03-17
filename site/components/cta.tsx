import { CopyButton } from "@/components/copy-button";

export function Cta() {
  return (
    <section className="py-32 px-6 sm:px-10 relative noise overflow-hidden">
      <div className="ambient-glow w-[300px] h-[300px] bg-amber-200/30 top-0 right-1/4" />
      <div className="sep mb-32" />
      <div className="relative z-10 mx-auto max-w-lg">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter gradient-text">
            Start now
          </h2>
          <p className="mt-4 text-stone-400 text-sm">
            One install. Works everywhere node runs.
          </p>
          <div className="mt-10">
            <CopyButton text="npm i -g @needtools/need" />
          </div>
          <div
            className="mt-8 flex gap-6 text-[10px] text-stone-300"
            style={{ fontFamily: "var(--font-jet)" }}
          >
            <span>node 18+</span>
            <span>·</span>
            <span>MIT</span>
            <span>·</span>
            <span>~2MB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
