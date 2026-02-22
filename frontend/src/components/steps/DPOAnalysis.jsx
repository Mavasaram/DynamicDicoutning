import { motion } from 'framer-motion'

function fmt(n) {
  if (typeof n !== 'number') return n
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function DPOAnalysis({ dpo, discount }) {
  const columns = [
    {
      label: 'Current State',
      sub: 'Pay at standard Net 45',
      color: 'text-slate-300',
      border: 'border-slate-700',
      rows: [
        { label: 'Payment Date', value: dpo.standard_payment_date, highlight: false },
        { label: 'DPO', value: `${dpo.dpo_current} days`, highlight: false },
        { label: 'Cash Impact', value: '$0 (future payment)', highlight: false },
        { label: 'Cash Saved', value: 'N/A', highlight: false },
        { label: 'Working Capital Ratio', value: dpo.working_capital_ratio_current, highlight: false },
        { label: 'AI Assessment', value: 'Standard', highlight: false },
      ],
    },
    {
      label: 'If Discount Taken',
      sub: discount.recommended_method,
      color: 'text-gold-400',
      border: 'border-gold-600/40',
      bg: 'bg-gold-500/5',
      rows: [
        { label: 'Payment Date', value: dpo.discount_payment_date, highlight: true },
        { label: 'DPO', value: `${dpo.dpo_if_discount} days`, highlight: true },
        { label: 'Cash Impact', value: fmt(dpo.cash_impact_discount), highlight: false },
        { label: 'Cash Saved', value: fmt(dpo.cash_saved), highlight: true },
        { label: 'Working Capital Ratio', value: dpo.working_capital_ratio_discount, highlight: false },
        { label: 'AI Assessment', value: 'RECOMMENDED', highlight: true },
      ],
    },
  ]

  const dpoImprovement = dpo.dpo_improvement || (dpo.dpo_current - dpo.dpo_if_discount).toFixed(1)

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">4</span>
        📊 DPO &amp; Working Capital Impact Analysis
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Analysis of payment timing impact on Days Payable Outstanding (DPO) and working capital position.
      </p>

      {/* DPO improvement banner */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {[
          { label: 'Current DPO', value: `${dpo.dpo_current} days`, sub: 'Company average', color: 'text-slate-300' },
          { label: 'DPO if Discount', value: `${dpo.dpo_if_discount} days`, sub: 'After early payment', color: 'text-gold-400' },
          { label: 'Improvement', value: `${dpoImprovement} days`, sub: 'DPO reduction', color: 'text-green-400' },
        ].map(({ label, value, sub, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="metric-card text-center"
          >
            <p className="text-xs text-slate-500 truncate">{label}</p>
            <p className={`text-lg sm:text-2xl font-bold mono ${color}`}>{value}</p>
            <p className="text-xs text-slate-600 hidden sm:block">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="grid md:grid-cols-2 gap-4">
        {columns.map((col, ci) => (
          <motion.div
            key={col.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
            className={`rounded-xl border ${col.border} ${col.bg || ''} overflow-hidden`}
          >
            <div className={`px-4 py-3 border-b ${col.border}`}>
              <p className={`font-semibold ${col.color}`}>{col.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{col.sub}</p>
            </div>
            <div className="divide-y divide-navy-800">
              {col.rows.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-2.5 gap-2">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className={`text-xs sm:text-sm font-medium mono text-right ${
                    label === 'AI Assessment' && value === 'RECOMMENDED'
                      ? 'text-green-400 font-bold'
                      : col.color && label !== 'AI Assessment'
                      ? col.label === 'If Discount Taken' ? 'text-white' : 'text-slate-300'
                      : 'text-slate-300'
                  }`}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cash flow insight */}
      <div className="mt-4 card-sm flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-semibold text-slate-200 text-sm">Cash Flow Insight</p>
          <p className="text-slate-400 text-sm mt-1">
            By taking the early payment discount, you save{' '}
            <strong className="text-green-400">{fmt(dpo.cash_saved)}</strong>{' '}
            while reducing DPO by <strong className="text-gold-400">{dpoImprovement} days</strong>.
            The annualised benefit far exceeds the <strong>8% cost of capital</strong>.
            Even with reduced working capital ratio (1.52 → 1.51), financial position remains strong.
          </p>
        </div>
      </div>
    </section>
  )
}
