import { motion } from 'framer-motion'

export default function PaymentVerification({ verifications, hasDiscrepancy }) {
  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm shrink-0">2</span>
        🔍 Payment Terms Verification
      </div>
      <p className="text-slate-400 text-xs sm:text-sm mb-4">
        AI Agent cross-referenced invoice terms against the master supplier agreement (Contract PGS-2026-SC-0047).
        {hasDiscrepancy && (
          <span className="text-amber-400 font-medium"> Discrepancies found — see highlighted rows.</span>
        )}
      </p>

      <div className="overflow-x-auto rounded-lg border border-navy-700">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="tbl-head">
              <th className="tbl-cell text-left">Parameter</th>
              <th className="tbl-cell text-left">Contract</th>
              <th className="tbl-cell text-left">Invoice</th>
              <th className="tbl-cell text-center">Status</th>
              <th className="tbl-cell text-left hidden md:table-cell">Note</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map((v, i) => (
              <motion.tr
                key={v.parameter}
                className={`tbl-row ${!v.match ? 'bg-amber-900/10' : ''}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <td className="tbl-cell font-medium text-slate-300 whitespace-nowrap">{v.parameter}</td>
                <td className="tbl-cell mono text-white whitespace-nowrap">{v.contract_value}</td>
                <td className={`tbl-cell mono font-medium whitespace-nowrap ${v.match ? 'text-white' : 'text-amber-400'}`}>
                  {v.invoice_value}
                </td>
                <td className="tbl-cell text-center whitespace-nowrap">
                  {v.match
                    ? <span className="badge-match">✓ Match</span>
                    : <span className="badge-mismatch">⚠ Mismatch</span>}
                </td>
                <td className="tbl-cell text-slate-500 text-xs hidden md:table-cell">{v.note || '—'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasDiscrepancy && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 sm:p-4 flex items-start gap-3"
        >
          <span className="text-amber-400 text-lg mt-0.5 shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-amber-400 text-sm">Action Required</p>
            <p className="text-amber-300/80 text-xs sm:text-sm mt-1">
              The invoice uses <strong>Net 30</strong> terms but the contract specifies <strong>Net 45</strong>.
              Buyer should reference the contract due date of <strong>March 18, 2026</strong> (not March 3, 2026),
              giving 15 additional days of payment flexibility.
            </p>
          </div>
        </motion.div>
      )}
    </section>
  )
}
