"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface ArenaStateProps {
  state: Record<string, unknown>
  scenarioId: string
}

/**
 * ArenaState - INTERACTABLE COMPONENT
 * 
 * This component displays the persistent state of the current scenario.
 * It morphs based on the scenario type, showing different stats and metrics.
 * 
 * In production, this would use Tambo's withInteractable HOC to make it
 * reactive to AI-driven state changes.
 */
export function ArenaState({ state, scenarioId }: ArenaStateProps) {
  // Render different layouts based on scenario
  const renderState = () => {
    switch (scenarioId) {
      case "zombie-survival":
        return renderZombieState(state)
      case "salary-negotiation":
        return renderSalaryState(state)
      case "space-station":
        return renderSpaceState(state)
      case "detective-mystery":
        return renderDetectiveState(state)
      default:
        return renderGenericState(state)
    }
  }

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 
          className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          Arena State
        </h2>
        {renderState()}
      </motion.div>
    </Card>
  )
}

// Zombie Survival State
function renderZombieState(state: Record<string, unknown>) {
  return (
    <div className="space-y-4">
      <StatBar label="Health" value={getNumber(state, "health", 100)} max={100} color="red" />
      <StatBar label="Ammo" value={getNumber(state, "ammo", 0)} max={50} color="yellow" />
      <StatBar label="Food" value={getNumber(state, "food", 0)} max={10} color="green" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Survivors" value={getNumber(state, "survivors", 0)} icon="👥" />
        <StatCard label="Time Left" value={`${getNumber(state, "timeRemaining", 0)}h`} icon="⏰" />
      </div>
      
      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <p className="text-sm text-slate-400">Location</p>
        <p className="text-lg font-semibold text-white">{getString(state, "location", "Unknown")}</p>
      </div>
    </div>
  )
}

// Salary Negotiation State
function renderSalaryState(state: Record<string, unknown>) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-lg">
        <p className="text-sm text-slate-400">Current Offer</p>
        <p className="text-3xl font-bold text-white">
          ${getNumber(state, "currentOffer", 0).toLocaleString()}
        </p>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg">
        <p className="text-sm text-slate-400">Target Salary</p>
        <p className="text-3xl font-bold text-green-400">
          ${getNumber(state, "targetSalary", 0).toLocaleString()}
        </p>
      </div>
      
      <StatBar label="Leverage" value={getNumber(state, "leverage", 50)} max={100} color="blue" />
      <StatBar label="Confidence" value={getNumber(state, "confidence", 50)} max={100} color="purple" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Round" value={getNumber(state, "round", 1)} icon="🔄" />
        <StatCard 
          label="Relationship" 
          value={getString(state, "relationship", "neutral")} 
          icon="🤝" 
        />
      </div>
    </div>
  )
}

// Space Station State
function renderSpaceState(state: Record<string, unknown>) {
  return (
    <div className="space-y-4">
      <StatBar label="Oxygen" value={getNumber(state, "oxygen", 0)} max={100} color="cyan" />
      <StatBar label="Power" value={getNumber(state, "power", 0)} max={100} color="yellow" />
      <StatBar label="Hull Integrity" value={getNumber(state, "hull", 0)} max={100} color="red" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Crew" value={getNumber(state, "crew", 0)} icon="👨‍🚀" />
        <StatCard label="Systems" value={getString(state, "systems", "unknown")} icon="⚙️" />
      </div>
      
      <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
        <p className="text-sm text-red-400 font-semibold">⚠️ Orbit Status</p>
        <p className="text-lg text-white">{getString(state, "orbit", "Unknown")}</p>
      </div>
    </div>
  )
}

// Detective Mystery State
function renderDetectiveState(state: Record<string, unknown>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Evidence" value={getNumber(state, "evidence", 0)} icon="📋" />
        <StatCard label="Suspects" value={getNumber(state, "suspects", 0)} icon="🕵️" />
        <StatCard label="Leads" value={getNumber(state, "leads", 0)} icon="🔍" />
        <StatCard label="Time Left" value={`${getNumber(state, "time", 0)}h`} icon="⏰" />
      </div>
      
      <StatBar label="Reputation" value={getNumber(state, "reputation", 50)} max={100} color="purple" />
      
      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <p className="text-sm text-slate-400">Current Location</p>
        <p className="text-lg font-semibold text-white">{getString(state, "location", "Unknown")}</p>
      </div>
    </div>
  )
}

// Generic State (fallback)
function renderGenericState(state: Record<string, unknown>) {
  return (
    <div className="space-y-2">
      {Object.entries(state).map(([key, value]) => {
        const displayValue =
          value == null
            ? "—"
            : typeof value === "object"
              ? JSON.stringify(value)
              : String(value)

        return (
          <div key={key} className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
            <span className="text-sm text-slate-400 capitalize">{key}</span>
            <span className="text-sm font-semibold text-white">{displayValue}</span>
          </div>
        )
      })}
    </div>
  )
}

function getNumber(
  state: Record<string, unknown>,
  key: string,
  fallback: number
): number {
  const value = state[key]

  if (typeof value === "number" && !Number.isNaN(value)) return value
  if (typeof value === "string") {
    const num = Number(value)
    if (!Number.isNaN(num)) return num
  }

  return fallback
}

function getString(
  state: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const value = state[key]
  return typeof value === "string" && value.trim() ? value : fallback
}

// Helper Components
function StatBar({ 
  label, 
  value, 
  max, 
  color 
}: { 
  label: string
  value: number
  max: number
  color: "red" | "yellow" | "green" | "blue" | "purple" | "cyan"
}) {
  const percentage = (value / max) * 100
  const colorClasses = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-semibold text-white">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  icon 
}: { 
  label: string
  value: string | number
  icon: string
}) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-slate-400 uppercase">{label}</p>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}
