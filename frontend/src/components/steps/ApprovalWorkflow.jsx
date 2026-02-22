import { motion } from 'framer-motion'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const STATUS_STYLE = {
  completed: { dot: 'bg-green-400', line: 'border-green-800', text: 'text-green-400', badge: 'bg-green-900/30 text-green-400 border-green-800' },
  escalated: { dot: 'bg-amber-400', line: 'border-amber-800', text: 'text-amber-400', badge: 'bg-amber-900/30 text-amber-400 border-amber-800' },
  pending:   { dot: 'bg-slate-500', line: 'border-slate-700',  text: 'text-slate-400', badge: 'bg-slate-700/30 text-slate-400 border-slate-700' },
}

export default function ApprovalWorkflow({ data }) {
  const details = [
    { label: 'Invoice Amount',        value: fmt(data.amount) },
    { label: 'Department',            value: data.department },
    { label: 'Cost Center',           value: data.cost_center },
    { label: 'Approval Level',        value: data.level },
    { label: 'Primary Approver',      value: data.primary_approver },
    { label: 'Secondary Approver',    value: data.secondary_approver },
    { label: 'Initial Routing',       value: data.routing_time },
    { label: 'Final Status',          value: data.status },
  ]

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">6</span>
        ✅ Intelligent Routing &amp; Approval Management
      </div>
      <p className="text-slate-400 text-sm mb-5">
        AI Agent auto-routed the invoice based on amount threshold ($100K–$250K → Level 2 approval).
        Real-time status tracking with automated reminders.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Details table */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Approval Workflow Details</p>
          <div className="overflow-x-auto rounded-lg border border-navy-700">
            <table className="w-full min-w-[320px] text-sm">
              <tbody>
                {details.map(({ label, value }, i) => (
                  <tr key={label} className="tbl-row">
                    <td className="tbl-cell text-slate-400 font-medium w-44">{label}</td>
                    <td className={`tbl-cell font-medium ${
                      label === 'Final Status'
                        ? value === 'Approved' ? 'text-green-400' : 'text-amber-400'
                        : 'text-white'
                    }`}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Approval Timeline</p>
          <div className="relative">
            {data.timeline.map((entry, i) => {
              const s = STATUS_STYLE[entry.status] || STATUS_STYLE.pending
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.09 }}
                  className="flex gap-3 mb-3 last:mb-0"
                >
                  {/* Dot + line */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                    {i < data.timeline.length - 1 && (
                      <div className={`flex-1 w-px border-l-2 border-dashed min-h-[20px] ${s.line}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">{entry.action}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${s.badge}`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{entry.date} · {entry.user}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
