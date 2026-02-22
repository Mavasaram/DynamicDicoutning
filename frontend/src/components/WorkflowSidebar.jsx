export default function WorkflowSidebar({ steps, completedSteps, activeSection, onSelect, processedFiles, isOpen, onClose }) {
  return (
    <aside className={`
      fixed md:relative inset-y-0 left-0 z-40 md:z-auto
      w-64 md:w-56 shrink-0
      bg-navy-900 border-r border-navy-700
      overflow-y-auto py-4 flex flex-col
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between px-4 mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow Steps</p>
        <button
          onClick={onClose}
          className="md:hidden text-slate-500 hover:text-white text-lg leading-none p-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

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
