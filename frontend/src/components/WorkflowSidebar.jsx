export default function WorkflowSidebar({ steps, completedSteps, activeSection, onSelect, processedFiles }) {
  return (
    <aside className="w-56 shrink-0 bg-navy-900 border-r border-navy-700 overflow-y-auto py-4 hidden md:flex flex-col">
      <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workflow Steps</p>
      <nav className="flex-1 space-y-0.5">
        {steps.map((step, i) => {
          const done = completedSteps.includes(step.id)
          const active = activeSection === step.id
          return (
            <button
              key={step.id}
              onClick={() => onSelect(step.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-all ${
                active
                  ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500'
                  : done
                  ? 'text-slate-300 hover:bg-navy-800'
                  : 'text-slate-600 cursor-default'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                done
                  ? 'bg-green-900/50 border-green-700 text-green-400'
                  : 'border-navy-600 text-slate-600'
              }`}>
                {done ? '✓' : i + 1}
              </span>
              <span className="truncate">{step.label}</span>
            </button>
          )
        })}
      </nav>

      {processedFiles && processedFiles.length > 0 && (
        <div className="px-4 pt-4 border-t border-navy-800">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Processed Files</p>
          {processedFiles.map(f => (
            <p key={f} className="text-xs text-slate-500 truncate flex items-center gap-1">
              <span>📎</span> {f}
            </p>
          ))}
        </div>
      )}
    </aside>
  )
}
