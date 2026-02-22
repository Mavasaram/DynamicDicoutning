import { motion } from 'framer-motion'

export default function ProcessingAnimation({ steps, currentStep }) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 max-w-md w-full">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-gold-500/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
      </div>

      <div className="text-center">
        <h2 className="text-white font-semibold text-xl mb-1">AI Agent Processing</h2>
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-400 text-sm"
        >
          {steps[currentStep]}
        </motion.p>
      </div>

      {/* Step list */}
      <div className="w-full space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 text-sm px-4 py-2 rounded-lg transition-colors ${
              i < currentStep
                ? 'bg-green-900/20 text-green-400'
                : i === currentStep
                ? 'bg-gold-500/10 text-gold-400'
                : 'text-slate-600'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border shrink-0
              border-current">
              {i < currentStep ? '✓' : i === currentStep ? '●' : i + 1}
            </span>
            {step}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
