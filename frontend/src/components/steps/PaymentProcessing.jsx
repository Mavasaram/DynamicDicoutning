import { motion } from 'framer-motion'

function fmt(n) {
  if (typeof n !== 'number') return n
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function PaymentProcessing({ data }) {
  const fields = [
    { label: 'Final Approval Date',   value: data.final_approval_date, icon: '📅' },
    { label: 'Payment Method',         value: data.method,              icon: '🏦' },
    { label: 'Scheduled Payment Date', value: data.scheduled_date,      icon: '📆', highlight: true },
    { label: 'Payment Amount',         value: fmt(data.amount),          icon: '💵', highlight: true },
    { label: 'Discount Captured',      value: fmt(data.discount_captured), icon: '🏷️', green: true },
    { label: 'Vendor Bank Account',    value: data.bank_account,         icon: '🏛️' },
    { label: 'Payment Reference',      value: data.reference,            icon: '🔖' },
    { label: 'Payment File Generated', value: data.file_generated,       icon: '📁' },
    { label: 'Payment Status',         value: data.status,               icon: '🔄', status: true },
    { label: 'Confirmation Number',    value: data.confirmation,         icon: '✅', bold: true },
  ]

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">8</span>
        💳 Payment Processing &amp; Execution
      </div>
      <p className="text-slate-400 text-sm mb-5">
        All approvals obtained. AI Agent scheduled payment to capture the early payment discount
        before the Tier 4 window closes.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="overflow-hidden rounded-lg border border-navy-700">
            <table className="w-full text-sm">
              <tbody>
                {fields.map(({ label, value, icon, highlight, green, status, bold }, i) => (
                  <motion.tr
                    key={label}
                    className="tbl-row"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <td className="tbl-cell text-slate-400 w-44">
                      <span className="mr-2">{icon}</span>{label}
                    </td>
                    <td className={`tbl-cell mono font-medium ${
                      green    ? 'text-green-400' :
                      highlight? 'text-gold-400 font-bold' :
                      status   ? 'text-blue-400' :
                      bold     ? 'text-white font-bold' :
                      'text-white'
                    }`}>{value}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment summary */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/20 border border-green-700/50 rounded-xl p-5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Gross Invoice</span>
                <span className="text-white mono text-sm font-medium line-through text-slate-500">
                  {/* We don't have gross here, show net as reference */}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-y border-navy-700">
                <span className="text-slate-400 text-sm">Amount Paid</span>
                <span className="text-2xl font-bold text-gold-400 mono">{fmt(data.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Discount Saved</span>
                <span className="text-green-400 mono text-sm font-bold">{fmt(data.discount_captured)}</span>
              </div>
            </div>
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card-sm flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center text-2xl animate-pulse-slow">
                💳
              </div>
            </div>
            <div>
              <p className="font-bold text-white">{data.status}</p>
              <p className="text-xs text-slate-500">Ref: {data.confirmation}</p>
              <p className="text-xs text-blue-400 mt-1">ACH/EFT initiated to Wells Fargo</p>
            </div>
          </motion.div>

          {/* Discount window */}
          <div className="card-sm">
            <p className="text-xs text-slate-500 mb-2">EPD Tier 4 Window Status</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-navy-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '70%' }} />
              </div>
              <span className="text-xs text-green-400 shrink-0">Within window ✓</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Payment scheduled before March 3, 2026 deadline</p>
          </div>
        </div>
      </div>
    </section>
  )
}
