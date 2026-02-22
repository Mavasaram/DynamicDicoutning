import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchSampleAnalysis, uploadAndProcess } from './api'

import Header from './components/Header'
import FileUpload from './components/FileUpload'
import WorkflowSidebar from './components/WorkflowSidebar'
import ProcessingAnimation from './components/ProcessingAnimation'

import InvoiceCapture from './components/steps/InvoiceCapture'
import PaymentVerification from './components/steps/PaymentVerification'
import DiscountAnalysis from './components/steps/DiscountAnalysis'
import DPOAnalysis from './components/steps/DPOAnalysis'
import Renegotiation from './components/steps/Renegotiation'
import ApprovalWorkflow from './components/steps/ApprovalWorkflow'
import ExceptionHandling from './components/steps/ExceptionHandling'
import PaymentProcessing from './components/steps/PaymentProcessing'
import Reconciliation from './components/steps/Reconciliation'

const STEPS = [
  { id: 'invoice',       label: 'Invoice Capture',        icon: '📄' },
  { id: 'verification',  label: 'Verify Payment Terms',   icon: '🔍' },
  { id: 'discount',      label: 'Discount Analysis',      icon: '💰' },
  { id: 'dpo',           label: 'DPO & Working Capital',  icon: '📊' },
  { id: 'renegotiation', label: 'Term Renegotiation',     icon: '🤝' },
  { id: 'approval',      label: 'Approval Routing',       icon: '✅' },
  { id: 'escalation',    label: 'Exception Handling',     icon: '🚨' },
  { id: 'payment',       label: 'Payment Processing',     icon: '💳' },
  { id: 'reconciliation',label: 'Reconciliation & KPIs',  icon: '📈' },
]

const PROCESSING_MSGS = [
  'Ingesting invoice PDF…',
  'Parsing contract terms…',
  'Verifying payment terms…',
  'Calculating volume discount…',
  'Evaluating EPD tiers…',
  'Analysing DPO impact…',
  'Generating renegotiation plan…',
  'Routing approval workflow…',
  'Compiling KPI dashboard…',
]

export default function App() {
  const [mode, setMode] = useState('landing')   // landing | processing | results
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [activeSection, setActiveSection] = useState('invoice')
  const sectionRefs = useRef({})

  async function runSample() {
    setMode('processing')
    setProcessingStep(0)
    setCompletedSteps([])
    setError(null)

    for (let i = 0; i < PROCESSING_MSGS.length; i++) {
      setProcessingStep(i)
      await sleep(420)
    }

    try {
      const result = await fetchSampleAnalysis()
      setData(result)
      for (let i = 0; i < STEPS.length; i++) {
        await sleep(200)
        setCompletedSteps(prev => [...prev, STEPS[i].id])
      }
      setMode('results')
    } catch (e) {
      setError('Could not load analysis data. Please try again.')
      setMode('landing')
    }
  }

  async function handleUpload(files) {
    setMode('processing')
    setProcessingStep(0)
    setCompletedSteps([])
    setError(null)

    for (let i = 0; i < PROCESSING_MSGS.length; i++) {
      setProcessingStep(i)
      await sleep(380)
    }

    try {
      const result = await uploadAndProcess(files.invoice, files.contract, files.excel)
      setData(result)
      for (let i = 0; i < STEPS.length; i++) {
        await sleep(180)
        setCompletedSteps(prev => [...prev, STEPS[i].id])
      }
      setMode('results')
    } catch (e) {
      setError('Upload failed. Please ensure the backend is running.')
      setMode('landing')
    }
  }

  function scrollTo(id) {
    setActiveSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="h-screen flex flex-col bg-navy-950 overflow-hidden">
      <Header mode={mode} onReset={() => setMode('landing')} />

      <main className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-8 px-4 py-12"
            >
              {/* Hero */}
              <div className="text-center max-w-3xl">
                <div className="text-5xl mb-4">🤖</div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  Payable Agent <span className="text-gold-400">AI</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  AI-powered accounts payable automation — verifies payment terms, evaluates
                  early payment discounts, manages approvals, and optimises working capital.
                </p>
              </div>

              {/* Workflow steps — animation list style */}
              <div className="w-full max-w-sm space-y-1.5">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700 text-slate-300 text-sm"
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-navy-600 text-slate-400 shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-base leading-none">{s.icon}</span>
                    <span>{s.label}</span>
                  </motion.div>
                ))}
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg px-5 py-3 text-red-300 text-sm max-w-lg text-center">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button onClick={runSample} className="btn-primary flex items-center gap-2 text-base">
                  <span>⚡</span> Load Sample Data &amp; Analyse
                </button>
                <span className="text-slate-600 text-sm">or</span>
                <span className="text-slate-400 text-sm">Upload your own files below</span>
              </div>

              <FileUpload onSubmit={handleUpload} />
              <div className="h-4" />
            </motion.div>
          )}

          {mode === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 min-h-0 flex items-center justify-center"
            >
              <ProcessingAnimation
                steps={PROCESSING_MSGS}
                currentStep={processingStep}
              />
            </motion.div>
          )}

          {mode === 'results' && data && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 min-h-0 flex overflow-hidden"
            >
              {/* Sidebar */}
              <WorkflowSidebar
                steps={STEPS}
                completedSteps={completedSteps}
                activeSection={activeSection}
                onSelect={scrollTo}
                processedFiles={data.processed_files}
              />

              {/* Scrollable content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
                {/* Discrepancy banner */}
                {data.has_discrepancy && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-900/30 border border-amber-600/50 rounded-xl px-5 py-3 flex items-start gap-3"
                  >
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-400">Payment Terms Discrepancy Detected</p>
                      {data.discrepancy_details.map((d, i) => (
                        <p key={i} className="text-amber-300/80 text-sm mt-0.5">{d}</p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step sections */}
                {[
                  { id: 'invoice',       Component: InvoiceCapture,     props: { invoice: data.invoice, excelInvoices: data.excel_invoices } },
                  { id: 'verification',  Component: PaymentVerification, props: { verifications: data.payment_verification, hasDiscrepancy: data.has_discrepancy } },
                  { id: 'discount',      Component: DiscountAnalysis,    props: { analysis: data.discount_analysis } },
                  { id: 'dpo',           Component: DPOAnalysis,         props: { dpo: data.dpo_analysis, discount: data.discount_analysis } },
                  { id: 'renegotiation', Component: Renegotiation,       props: { data: data.renegotiation } },
                  { id: 'approval',      Component: ApprovalWorkflow,    props: { data: data.approval } },
                  { id: 'escalation',    Component: ExceptionHandling,   props: { data: data.escalation } },
                  { id: 'payment',       Component: PaymentProcessing,   props: { data: data.payment } },
                  { id: 'reconciliation',Component: Reconciliation,      props: { data: data.monthly_kpi } },
                ].map(({ id, Component, props }) => (
                  <motion.div
                    key={id}
                    ref={el => (sectionRefs.current[id] = el)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={completedSteps.includes(id) ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Component {...props} />
                  </motion.div>
                ))}

                <div className="h-16" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}
