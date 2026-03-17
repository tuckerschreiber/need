import { Terminal } from "@/components/terminal";

export function Demo() {
  return (
    <section className="pb-24 px-6">
      <div className="mx-auto max-w-xl">
        <Terminal>
          <div>
            <span className="text-amber-400">$</span>{" "}
            <span className="text-zinc-300">need search</span>{" "}
            <span className="text-zinc-500">&quot;convert pdf to markdown&quot;</span>
          </div>
          <div className="mt-1 text-zinc-700 text-[11px]">
            searching 2,847 tools · 0.12s
          </div>
          <div className="mt-4 space-y-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 text-[11px]">1.</span>
                <span className="text-amber-400 font-medium">marker</span>
                <span className="text-zinc-700 text-[11px]">97% match</span>
              </div>
              <div className="text-zinc-600 text-[11px] ml-5">
                pip install marker-pdf · 2.1k uses
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 text-[11px]">2.</span>
                <span className="text-amber-400 font-medium">pdf-to-markdown</span>
                <span className="text-zinc-700 text-[11px]">94% match</span>
              </div>
              <div className="text-zinc-600 text-[11px] ml-5">
                npm install pdf-to-markdown · 890 uses
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 text-[11px]">3.</span>
                <span className="text-amber-400 font-medium">pandoc</span>
                <span className="text-zinc-700 text-[11px]">92% match</span>
              </div>
              <div className="text-zinc-600 text-[11px] ml-5">
                brew install pandoc · 15.3k uses
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-amber-400">$</span>
            <span className="ml-1.5 inline-block w-1.5 h-3.5 bg-zinc-500 animate-pulse align-middle" />
          </div>
        </Terminal>
      </div>
    </section>
  );
}
