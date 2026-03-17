export function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-stone-200/60"
      style={{ backgroundColor: "rgba(250,250,249,0.92)" }}
    >
      <div
        className="mx-auto max-w-7xl flex items-center justify-between h-14 px-6 sm:px-10"
        style={{ fontFamily: "var(--font-jet)" }}
      >
        <span className="text-sm font-medium text-stone-900">
          need<span className="text-amber-500">.</span>
        </span>
        <div className="flex items-center gap-6 text-xs text-stone-400">
          <a href="#how-it-works" className="hover:text-stone-700 transition-colors hidden sm:block">
            how it works
          </a>
          <a href="#features" className="hover:text-stone-700 transition-colors hidden sm:block">
            features
          </a>
          <a
            href="https://github.com/tuckerschreiber/need"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-stone-900 text-stone-50 px-3 py-1 text-xs hover:bg-stone-800 transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
