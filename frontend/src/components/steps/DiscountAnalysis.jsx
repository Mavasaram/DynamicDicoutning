import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}

const STATUS_COLORS = {
  ACTIVE:    '#c9a227',
  EXPIRED:   '#4b5563',
  UPCOMING:  '#3b82f6',
  INELIGIBLE:'#6b7280',
}

const DYNAMIC_FORMULA = 'Rate = 3.50% × (45 − Days Elapsed) ÷ 44'

export default function DiscountAnalysis({ analysis }) {
  const [selectedTier, setSelectedTier] = useState(null)

  const { epd_tiers, discount_analysis } = { epd_tiers: analysis.epd_tiers, discount_analysis: analysis }

  // Chart data for EPD tier comparison
  const chartData = analysis.epd_tiers.map(t => ({
    name: `T${t.tier}`,
    fullName: t.name,
    savings: t.discount_amount,
    apr: t.apr,
    status: t.status,
  }))

  // Dynamic discounting chart — rate over time
  const dynamicData = Array.from({ length: 45 }, (_, i) => ({
    day: i + 1,
    rate: parseFloat((3.5 * (45 - (i + 1)) / 44).toFixed(4)),
  }))

  const activeTiers = analysis.epd_tiers.filter(t => t.status === 'ACTIVE')
  const best = analysis.best_tier

  return (
    <section className="card">
      <div className="section-title">
        <span className="w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">3</span>
        💰 Discount Terms &amp; Early Payment Analysis
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Gross Invoice', value: fmt(analysis.gross_amount), color: 'text-white' },
          { label: `Volume Discount (${analysis.volume_discount_rate_pct})`, value: `−${fmt(analysis.volume_discount_amount)}`, color: 'text-green-400' },
          { label: 'Net Invoice Amount', value: fmt(analysis.net_invoice_amount), color: 'text-gold-400 text-lg font-bold' },
          { label: 'Days Since Receipt', value: `Day ${analysis.days_elapsed}`, color: 'text-blue-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="metric-card">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`font-semibold mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Volume discount breakdown */}
      <div className="card-sm mb-5 flex flex-wrap gap-4 items-center">
        <div>
          <p className="text-xs text-slate-500 mb-1">Annual Spend Tier</p>
          <p className="text-sm font-semibold text-white">{analysis.volume_tier_label}</p>
        </div>
        <div className="h-8 w-px bg-navy-600 hidden sm:block" />
        <div>
          <p className="text-xs text-slate-500 mb-1">Volume Discount Rate</p>
          <p className="text-2xl font-bold text-green-400">{analysis.volume_discount_rate_pct}</p>
        </div>
        <div className="h-8 w-px bg-navy-600 hidden sm:block" />
        <div>
          <p className="text-xs text-slate-500 mb-1">Amount Saved</p>
          <p className="text-sm font-semibold text-green-400">{fmt(analysis.volume_discount_amount)}</p>
        </div>
        <div className="ml-auto">
          <span className="badge-match text-sm">Auto-Applied ✓</span>
        </div>
      </div>

      {/* EPD Tiers */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Tier cards */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">EPD Tier Analysis</p>
          <div className="space-y-2">
            {analysis.epd_tiers.map((tier, i) => {
              const color = STATUS_COLORS[tier.status] || '#6b7280'
              return (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setSelectedTier(selectedTier?.tier === tier.tier ? null : tier)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    tier.status === 'ACTIVE'
                      ? 'border-gold-600/50 bg-gold-500/5 hover:bg-gold-500/10'
                      : 'border-navy-700 bg-navy-800 hover:bg-navy-750'
                  } ${selectedTier?.tier === tier.tier ? 'ring-1 ring-gold-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: color + '30', color }}>
                        {tier.tier}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{tier.name}</p>
                        <p className="text-xs text-slate-500">{tier.window}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color }}>{tier.rate_pct}</p>
                      <p className="text-xs text-slate-500">{tier.apr}% APR</p>
                    </div>
                  </div>
                  {tier.status === 'ACTIVE' && (
                    <div className="mt-2 pt-2 border-t border-navy-700 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Saves: </span>
                        <span className="text-green-400 font-semibold">{fmt(tier.discount_amount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Pay: </span>
                        <span className="text-white font-semibold">{fmt(tier.amount_payable)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Deadline: </span>
                        <span className="text-amber-400">{tier.deadline}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Days left: </span>
                        <span className="text-white">{tier.days_remaining} days</span>
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      tier.status === 'ACTIVE'   ? 'bg-gold-500/20 text-gold-400 border border-gold-600/40' :
                      tier.status === 'EXPIRED'  ? 'bg-slate-700/50 text-slate-500 border border-slate-700' :
                      tier.status === 'UPCOMING' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' :
                      'bg-slate-700/30 text-slate-500 border border-slate-700'
                    }`}>{tier.status}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bar chart */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Savings Comparison by Tier (USD)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(1)}K`} />
              <Tooltip
                contentStyle={{ background: '#162032', border: '1px solid #1e3a5f', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(v, n, props) => [
                  `$${v.toFixed(2)} — ${props.payload.fullName}`,
                  'Discount Saved'
                ]}
              />
              <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || '#4b5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Dynamic discounting */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Dynamic Discounting Rate Today (Day {analysis.days_elapsed})
            </p>
            <div className="card-sm">
              <p className="text-xs text-slate-500 mb-1 mono">{DYNAMIC_FORMULA}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{analysis.dynamic_discount_rate}%</p>
                  <p className="text-xs text-slate-500">Current dynamic rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">{fmt(analysis.dynamic_discount_amount)} saved</p>
                  <p className="text-xs text-slate-500">Pay {fmt(analysis.dynamic_amount_payable)}</p>
                </div>
              </div>
              {analysis.dynamic_discount_amount > (best?.discount_amount || 0) && (
                <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                  <span>⚡</span> Dynamic discounting saves MORE than Tier 4 today!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3 sm:gap-4 ${
          analysis.recommendation === 'TAKE DISCOUNT'
            ? 'bg-green-900/20 border-green-700/50'
            : 'bg-slate-800/50 border-slate-700'
        }`}
      >
        <span className="text-2xl sm:text-3xl mt-0.5 shrink-0">{analysis.recommendation === 'TAKE DISCOUNT' ? '✅' : '📋'}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base sm:text-lg text-white">
            AI Recommendation: <span className={analysis.recommendation === 'TAKE DISCOUNT' ? 'text-green-400' : 'text-slate-400'}>
              {analysis.recommendation}
            </span>
          </p>
          <p className="text-slate-400 text-sm mt-1">{analysis.recommendation_detail}</p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Method', value: analysis.recommended_method },
              { label: 'Savings', value: fmt(analysis.recommended_savings) },
              { label: 'Pay Amount', value: fmt(analysis.recommended_payment) },
              { label: 'Pay By', value: analysis.recommended_date },
            ].map(({ label, value }) => (
              <div key={label} className="bg-navy-800/60 rounded-lg p-2">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-white mono">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
