export default function Header({ mode, onReset, onToggleSidebar }) {
  return (
    <header className="bg-navy-900 border-b border-navy-700 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger — mobile only, results mode */}
        {mode === 'results' && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex flex-col gap-1 p-1.5 rounded text-slate-400 hover:text-white"
            aria-label="Toggle steps"
          >
            <span className="block w-5 h-0.5 bg-current" />
            <span className="block w-5 h-0.5 bg-current" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        )}
        <span className="text-xl sm:text-2xl">🤖</span>
        <div>
          <h1 className="text-white font-bold text-sm sm:text-base leading-tight">
            Payable Agent <span className="text-gold-400">AI</span>
          </h1>
          <p className="text-slate-500 text-xs">
            by <span className="text-gold-400 font-semibold">CognixOne.ai</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {mode === 'results' && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white border border-navy-600 hover:border-navy-400 px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            ← New Analysis
          </button>
        )}
      </div>
    </header>
  )
}
