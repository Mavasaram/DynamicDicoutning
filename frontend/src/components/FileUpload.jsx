import { useState, useRef } from 'react'

export default function FileUpload({ onSubmit }) {
  const [files, setFiles] = useState({ invoice: null, contract: null, excel: null })
  const [dragging, setDragging] = useState(null)

  const refs = {
    invoice:  useRef(),
    contract: useRef(),
    excel:    useRef(),
  }

  function pick(key, file) {
    if (!file) return
    setFiles(f => ({ ...f, [key]: file }))
  }

  function handleDrop(key, e) {
    e.preventDefault()
    setDragging(null)
    const file = e.dataTransfer.files[0]
    pick(key, file)
  }

  const hasAny = Object.values(files).some(Boolean)

  const slots = [
    { key: 'invoice',  label: 'Invoice PDF',        accept: '.pdf', icon: '📄', hint: 'e.g. sample_invoice_INV-2025-45678.pdf' },
    { key: 'contract', label: 'Supplier Contract PDF', accept: '.pdf', icon: '📋', hint: 'e.g. Supplier_Contract_ABC_Supplies_Inc.pdf' },
    { key: 'excel',    label: 'Invoices Excel',     accept: '.xlsx', icon: '📊', hint: 'e.g. sample_invoices.xlsx' },
  ]

  return (
    <div className="w-full max-w-3xl">
      <p className="text-slate-500 text-sm text-center mb-4">Or upload your own files for a custom analysis:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {slots.map(({ key, label, accept, icon, hint }) => (
          <div
            key={key}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              dragging === key
                ? 'border-gold-500 bg-gold-500/5'
                : files[key]
                ? 'border-green-600 bg-green-900/10'
                : 'border-navy-700 hover:border-navy-500 bg-navy-900'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(key) }}
            onDragLeave={() => setDragging(null)}
            onDrop={e => handleDrop(key, e)}
            onClick={() => refs[key].current?.click()}
          >
            <input
              ref={refs[key]}
              type="file"
              accept={accept}
              className="hidden"
              onChange={e => pick(key, e.target.files[0])}
            />
            <div className="text-3xl mb-2">{files[key] ? '✅' : icon}</div>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-600 mt-1">
              {files[key] ? files[key].name : hint}
            </p>
          </div>
        ))}
      </div>

      {hasAny && (
        <div className="flex justify-center">
          <button
            onClick={() => onSubmit(files)}
            className="btn-primary flex items-center gap-2"
          >
            <span>🚀</span> Process Uploaded Files
          </button>
        </div>
      )}
    </div>
  )
}
