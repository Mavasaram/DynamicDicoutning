import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'

function fmtM(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function KpiCard({ label, value, target, unit = '', color = 'text-white', good }) {
  return (
    <div className="metric-card">
      <p className="text-xs text-slate-500 truncate">{label}</p>
      <p className={`text-lg sm:text-xl font-bold mono ${color}`}>{value}{unit}</p>
      {target && (
        <p className={`text-xs ${good ? 'text-green-400' : 'text-slate-500'}`}>
          {good ? '✓ ' : ''}Target: {target}
        </p>
      )}
    </div>
  )
}

export default function Reconciliation({ data }) {
  const metrics = [
    { label: 'Total Invoices Processed', value: data.total_invoices.toLocaleString(), color: 'text-gold-400' },
    { label: 'Total Payment Value', value: fmtM(data.total_payment_value), color: 'text-gold-400' },
    { label: 'STP Rate', value: data.stp_rate, unit: '%', target: '>70%', good: data.stp_rate >= 70, color: data.stp_rate >= 70 ? 'text-green-400' : 'text-amber-400' },
    { label: 'Avg Approval Cycle', value: data.avg_approval_hours, unit: ' hrs', target: `<${data.target_approval_hours}h`, good: data.avg_approval_hours < data.target_approval_hours, color: data.avg_approval_hours < data.target_approval_hours ? 'text-green-400' : 'text-amber-400' },
    { label: 'Discounts Captured', value: fmtM(data.discounts_captured), color: 'text-green-400' },
    { label: 'Discount Capture Rate', value: data.discount_capture_rate, unit: '%', target: '>95%', good: data.discount_capture_rate >= 95, color: data.discount_capture_rate >= 95 ? 'text-green-400' : 'text-amber-400' },
    { label: 'DPO', value: data.dpo, unit: ' days', target: `${data.dpo_target_low}–${data.dpo_target_high} days`, good: data.dpo >= data.dpo_target_low && data.dpo <= data.dpo_target_high, color: 'text-gold-400' },
    { label: 'Payment Accuracy', value: data.payment_accuracy, unit: '%', target: '>99%', good: data.payment_accuracy >= 99, color: data.payment_accuracy >= 99 ? 'text-green-400' : 'text-amber-400' },
    { label: 'SLA Compliance', value: data.sla_compliance, unit: '%', target: '>90%', good: data.sla_compliance >= 90, color: data.sla_compliance >= 90 ? 'text-green-400' : 'text-amber-400' },
  ]

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">9</span>
        📈 Reconciliation &amp; Reporting
      </div>
      <p className="text-slate-400 text-sm mb-2">
        Monthly Summary Report · <span className="text-gold-400 font-semibold">{data.period}</span>
      </p>
      <p className="text-slate-500 text-xs mb-5">
        AI Agent automatically reconciled all payments against invoices and updated ERP records.
      </p>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <KpiCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Trend charts */}
      {data.monthly_trend && (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">DPO Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                <YAxis domain={[40, 50]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#162032', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="dpo" stroke="#c9a227" strokeWidth={2} dot={{ r: 3 }} name="DPO (days)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Discount Capture Rate &amp; STP Rate</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#162032', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }}
                  formatter={v => `${v}%`}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="discount_rate" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Discount Capture %" />
                <Line type="monotone" dataKey="stp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="STP Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Key benefits */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {[
          { icon: '🎯', text: 'Automated verification reduces manual errors by 95%' },
          { icon: '💰', text: '98% early payment discount capture rate achieved' },
          { icon: '📊', text: 'Real-time DPO tracking — within target 42–45 day range' },
          { icon: '⚡', text: 'Smart routing: approval cycle reduced from 3–4 days to 18.5 hours' },
          { icon: '🤖', text: '73% straight-through processing — no manual intervention' },
          { icon: '✅', text: '94% SLA compliance across all approval workflows' },
        ].map(({ icon, text }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="flex items-start gap-2 text-sm text-slate-400"
          >
            <span className="shrink-0">{icon}</span>
            {text}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
