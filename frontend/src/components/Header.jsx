export default function Header({ mode, onReset }) {
  return (
    <header className="bg-navy-900 border-b border-navy-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">
            Payable Agent <span className="text-gold-400">AI</span>
          </h1>
          <p className="text-slate-500 text-xs">Dynamic Discounting Platform</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Powered by</span>
          <span className="text-xs font-semibold text-gold-400">Pinnacle Global Solutions LLC</span>
        </div>
        {mode === 'results' && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white border border-navy-600 hover:border-navy-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← New Analysis
          </button>
        )}
      </div>
    </header>
  )
}
