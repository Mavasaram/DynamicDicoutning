import { motion } from 'framer-motion'

function fmtM(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function Renegotiation({ data }) {
  const fields = [
    { label: 'Vendor',               value: data.vendor },
    { label: 'Invoice Terms',        value: data.current_invoice_terms, warn: true },
    { label: 'Contract Terms',       value: data.contract_terms },
    { label: 'Annual Spend',         value: data.annual_spend_formatted },
    { label: 'Payment History',      value: data.payment_history },
    { label: 'Industry Standard',    value: data.industry_standard },
    { label: 'Recommended Action',   value: data.recommended_terms },
  ]

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">5</span>
        🤝 Payment Term Renegotiation Recommendation
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Data-driven recommendations based on historical payment patterns, vendor importance, and cash flow analysis.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Analysis table */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Renegotiation Analysis</p>
          <div className="overflow-hidden rounded-lg border border-navy-700">
            <table className="w-full text-sm">
              <tbody>
                {fields.map(({ label, value, warn }, i) => (
                  <motion.tr
                    key={label}
                    className="tbl-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <td className="tbl-cell text-slate-400 font-medium w-40">{label}</td>
                    <td className={`tbl-cell font-semibold ${warn ? 'text-amber-400' : 'text-white'}`}>{value}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Benefit range */}
          <div className="mt-4 bg-green-900/20 border border-green-800/40 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estimated Working Capital Benefit</p>
            <p className="text-2xl font-bold text-green-400">
              {fmtM(data.estimated_benefit_low)} – {fmtM(data.estimated_benefit_high)}
            </p>
            <p className="text-xs text-slate-500 mt-1">annually (based on payment term optimisation)</p>
          </div>
        </div>

        {/* Talking points */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Procurement Talking Points</p>
          <div className="space-y-3">
            {data.talking_points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 card-sm"
              >
                <span className="w-6 h-6 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
