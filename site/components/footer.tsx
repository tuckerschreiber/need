export function Footer() {
  return (
    <footer className="border-t border-stone-200">
      <div
        className="mx-auto max-w-7xl flex items-center justify-between py-6 px-6 sm:px-10 text-[11px] text-stone-300"
        style={{ fontFamily: "var(--font-jet)" }}
      >
        <span>need</span>
        <a
          href="https://github.com/tuckerschreiber/need"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-stone-500 transition-colors"
        >
          src ↗
        </a>
      </div>
    </footer>
  );
}
