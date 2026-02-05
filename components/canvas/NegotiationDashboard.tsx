"use client"

import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Briefcase } from "lucide-react"

interface NegotiationDashboardProps {
  currentOffer: number
  targetSalary: number
  marketRate: number
  leveragePoints: Array<{
    title: string
    description: string
    value: number
  }>
  relationshipScore: number
}

/**
 * NegotiationDashboard - SCENARIO-SPECIFIC CANVAS COMPONENT
 * 
 * For salary negotiation scenario:
 * - Visual salary comparison bar chart
 * - Leverage point cards
 * - Relationship meter
 * - Animated value updates
 */
export function NegotiationDashboard({
  currentOffer,
  targetSalary,
  marketRate,
  leveragePoints,
  relationshipScore
}: NegotiationDashboardProps) {
  const maxSalary = Math.max(currentOffer, targetSalary, marketRate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-lg p-6 space-y-6"
    >
      <h3
        className="text-sm font-semibold text-slate-300 uppercase tracking-wide"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        Negotiation Dashboard
      </h3>

      {/* Salary Comparison */}
      <div className="space-y-4">
        <h4 className="text-xs text-slate-400 uppercase tracking-wide">Salary Comparison</h4>
        
        <div className="space-y-3">
          {/* Current Offer */}
          <SalaryBar
            label="Current Offer"
            amount={currentOffer}
            maxAmount={maxSalary}
            color="var(--electric-cyan)"
            icon={<DollarSign className="w-4 h-4" />}
            delay={0}
          />

          {/* Target Salary */}
          <SalaryBar
            label="Your Target"
            amount={targetSalary}
            maxAmount={maxSalary}
            color="var(--quantum-gold)"
            icon={<TrendingUp className="w-4 h-4" />}
            delay={0.1}
          />

          {/* Market Rate */}
          <SalaryBar
            label="Market Rate"
            amount={marketRate}
            maxAmount={maxSalary}
            color="var(--plasma-purple)"
            icon={<Briefcase className="w-4 h-4" />}
            delay={0.2}
          />
        </div>
      </div>

      {/* Leverage Points */}
      <div className="space-y-3">
        <h4 className="text-xs text-slate-400 uppercase tracking-wide">Your Leverage</h4>
        <div className="grid grid-cols-1 gap-2">
          {leveragePoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass border border-slate-700 rounded-lg p-3 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <h5 className="text-sm font-semibold text-white">{point.title}</h5>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  +{point.value}%
                </span>
              </div>
              <p className="text-xs text-slate-400">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Relationship Meter */}
      <div className="space-y-3">
        <h4 className="text-xs text-slate-400 uppercase tracking-wide">Recruiter Relationship</h4>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={relationshipScore >= 70 ? "var(--electric-cyan)" : relationshipScore >= 40 ? "var(--warning-amber)" : "var(--neon-magenta)"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - relationshipScore / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 8px ${relationshipScore >= 70 ? "var(--electric-cyan)" : relationshipScore >= 40 ? "var(--warning-amber)" : "var(--neon-magenta)"})`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {relationshipScore}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-1">
              {relationshipScore >= 70 ? "Excellent rapport" : relationshipScore >= 40 ? "Building trust" : "Needs improvement"}
            </p>
            <p className="text-xs text-slate-500">
              {relationshipScore >= 70 ? "They're receptive to your requests" : relationshipScore >= 40 ? "Continue demonstrating value" : "Focus on relationship building"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SalaryBar({
  label,
  amount,
  maxAmount,
  color,
  icon,
  delay
}: {
  label: string
  amount: number
  maxAmount: number
  color: string
  icon: React.ReactNode
  delay: number
}) {
  const percentage = (amount / maxAmount) * 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="text-slate-400">{label}</span>
        </div>
        <span className="font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          ${amount.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
