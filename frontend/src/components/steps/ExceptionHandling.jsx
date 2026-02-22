import { motion } from 'framer-motion'

export default function ExceptionHandling({ data }) {
  const overdue = data.elapsed_hours - data.sla_hours

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">7</span>
        🚨 Exception Handling &amp; Escalation
      </div>
      <p className="text-slate-400 text-sm mb-5">
        When the Level 2 approval exceeded the 48-hour SLA, the AI Agent automatically escalated to the CFO
        to maintain processing velocity and protect the early payment discount window.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SLA metrics */}
        <div className="space-y-3">
          {[
            { label: 'Approval SLA',       value: `${data.sla_hours} hours`, icon: '⏱️', color: 'text-slate-300' },
            { label: 'Time Elapsed',        value: `${data.elapsed_hours} hours (${data.elapsed_hours / 24} days)`, icon: '⏰', color: 'text-amber-400' },
            { label: 'SLA Breach',          value: data.breach ? `YES — ${overdue} hours overdue` : 'NO', icon: data.breach ? '✗' : '✓', color: data.breach ? 'text-red-400' : 'text-green-400' },
            { label: 'Escalation Triggered',value: data.triggered, icon: '🚨', color: 'text-amber-400' },
            { label: 'Escalated To',        value: data.escalated_to, icon: '👤', color: 'text-white' },
            { label: 'Escalation Email',    value: data.email_sent ? 'YES — includes full approval history' : 'NO', icon: '📧', color: 'text-green-400' },
            { label: 'Resolution',          value: data.resolution, icon: '✅', color: 'text-green-400' },
          ].map(({ label, value, icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 card-sm"
            >
              <span className="text-xl shrink-0">{icon}</span>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-slate-400">{label}</span>
                <span className={`text-sm font-semibold ${color}`}>{value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Escalation alert */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700/50 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">🚨</span>
              <div>
                <p className="font-bold text-red-400 text-base">SLA Breach Alert</p>
                <p className="text-sm text-red-300/80 mt-1">
                  Level 2 approval exceeded the 48-hour SLA by{' '}
                  <strong>{overdue} hours</strong>. Automatic escalation triggered.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-green-900/20 border border-green-700/50 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="font-bold text-green-400 text-base">Resolved</p>
                <p className="text-sm text-green-300/80 mt-1">
                  CFO approved the invoice on February 8, 2026, still within the Tier 4
                  EPD window (deadline: March 3). Discount opportunity preserved.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="card-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">EPD Window Status</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-navy-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gold-500"
                  style={{ width: `${Math.min((21 / 30) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gold-400 shrink-0">Day 21 / 30</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Tier 4 EPD window: 9 days remaining — discount still capturable</p>
          </div>
        </div>
      </div>
    </section>
  )
}
