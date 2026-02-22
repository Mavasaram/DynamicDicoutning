import { motion } from 'framer-motion'

function fmt(n) {
  if (typeof n !== 'number') return n
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function InvoiceCapture({ invoice, excelInvoices }) {
  const fields = [
    { label: 'Invoice Number',  value: invoice.invoice_number },
    { label: 'Vendor',          value: invoice.vendor },
    { label: 'Invoice Date',    value: invoice.invoice_date },
    { label: 'Due Date',        value: invoice.due_date + ' (' + invoice.payment_terms + ')' },
    { label: 'Invoice Amount',  value: fmt(invoice.invoice_amount) },
    { label: 'Payment Method',  value: invoice.payment_method },
    { label: 'Currency',        value: invoice.currency },
  ]

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">1</span>
        📄 Invoice Receipt &amp; Data Capture
      </div>
      <p className="text-slate-400 text-sm mb-5">
        The Payable Agent received and validated this invoice. All required fields are present and complete.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Invoice fields */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Invoice Fields</p>
          <div className="overflow-hidden rounded-lg border border-navy-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="tbl-head">
                  <th className="tbl-cell text-left">Field</th>
                  <th className="tbl-cell text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(({ label, value }, i) => (
                  <motion.tr
                    key={label}
                    className="tbl-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <td className="tbl-cell text-slate-400 font-medium">{label}</td>
                    <td className="tbl-cell text-white mono">{value}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Line items */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Line Items</p>
          <div className="overflow-hidden rounded-lg border border-navy-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="tbl-head">
                  <th className="tbl-cell text-left">SKU</th>
                  <th className="tbl-cell text-left">Description</th>
                  <th className="tbl-cell text-right">Qty</th>
                  <th className="tbl-cell text-right">Unit</th>
                  <th className="tbl-cell text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item, i) => (
                  <tr key={i} className="tbl-row">
                    <td className="tbl-cell mono text-blue-400">{item.sku}</td>
                    <td className="tbl-cell text-slate-300">{item.description}</td>
                    <td className="tbl-cell text-right">{item.quantity}</td>
                    <td className="tbl-cell text-right mono">{fmt(item.unit_price)}</td>
                    <td className="tbl-cell text-right mono font-semibold text-white">{fmt(item.extended_amount)}</td>
                  </tr>
                ))}
                <tr className="bg-navy-800">
                  <td colSpan={4} className="tbl-cell text-right font-semibold text-slate-400">Total</td>
                  <td className="tbl-cell text-right mono font-bold text-gold-400">
                    {fmt(invoice.invoice_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Excel invoices summary */}
      {excelInvoices && excelInvoices.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Invoice Register (Excel)</p>
          <div className="overflow-x-auto rounded-lg border border-navy-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="tbl-head">
                  <th className="tbl-cell text-left">Invoice #</th>
                  <th className="tbl-cell text-left">Vendor</th>
                  <th className="tbl-cell text-left">Date</th>
                  <th className="tbl-cell text-right">Amount</th>
                  <th className="tbl-cell text-left">Terms</th>
                  <th className="tbl-cell text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {excelInvoices.map((row, i) => (
                  <tr key={i} className={`tbl-row ${row.invoice_number === invoice.invoice_number ? 'bg-gold-500/5' : ''}`}>
                    <td className="tbl-cell mono text-blue-400 font-medium">{row.invoice_number}</td>
                    <td className="tbl-cell text-slate-300">{row.vendor}</td>
                    <td className="tbl-cell text-slate-400">{row.invoice_date}</td>
                    <td className="tbl-cell text-right mono">{fmt(row.amount)}</td>
                    <td className="tbl-cell text-slate-400">{row.payment_terms}</td>
                    <td className="tbl-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        row.status?.includes('Paid')
                          ? 'bg-green-900/30 text-green-400 border border-green-800'
                          : 'bg-amber-900/30 text-amber-400 border border-amber-800'
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
