"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ArenaStateProps {
  state: Record<string, any>
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
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 
          className="text-2xl font-bold text-primary mb-6"
        >
          Arena State
        </h2>
        {renderState()}
      </motion.div>
    </Card>
  )
}

// Zombie Survival State
function renderZombieState(state: Record<string, any>) {
  return (
    <div className="space-y-4">
      <StatBar label="Health" value={state.health || 100} max={100} color="red" />
      <StatBar label="Ammo" value={state.ammo || 0} max={50} color="yellow" />
      <StatBar label="Food" value={state.food || 0} max={10} color="green" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Survivors" value={state.survivors || 0} icon="👥" />
        <StatCard label="Time Left" value={`${state.timeRemaining || 0}h`} icon="⏰" />
      </div>
      
      <div className="mt-4 p-3 bg-primary border-2 border-light rounded-lg">
        <p className="text-sm text-secondary">Location</p>
        <p className="text-lg font-semibold text-primary">{state.location || "Unknown"}</p>
      </div>
    </div>
  )
}

// Salary Negotiation State
function renderSalaryState(state: Record<string, any>) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary border-2 border-medium rounded-lg">
        <p className="text-sm text-secondary">Current Offer</p>
        <p className="text-3xl font-bold text-primary">
          ${(state.currentOffer || 0).toLocaleString()}
        </p>
      </div>
      
      <div className="p-4 bg-primary border-2 border-medium rounded-lg">
        <p className="text-sm text-secondary">Target Salary</p>
        <p className="text-3xl font-bold text-accent-success">
          ${(state.targetSalary || 0).toLocaleString()}
        </p>
      </div>
      
      <StatBar label="Leverage" value={state.leverage || 50} max={100} color="blue" />
      <StatBar label="Confidence" value={state.confidence || 50} max={100} color="purple" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Round" value={state.round || 1} icon="🔄" />
        <StatCard 
          label="Relationship" 
          value={state.relationship || "neutral"} 
          icon="🤝" 
        />
      </div>
    </div>
  )
}

// Space Station State
function renderSpaceState(state: Record<string, any>) {
  return (
    <div className="space-y-4">
      <StatBar label="Oxygen" value={state.oxygen || 0} max={100} color="cyan" />
      <StatBar label="Power" value={state.power || 0} max={100} color="yellow" />
      <StatBar label="Hull Integrity" value={state.hull || 0} max={100} color="red" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Crew" value={state.crew || 0} icon="👨‍🚀" />
        <StatCard label="Systems" value={state.systems || "unknown"} icon="⚙️" />
      </div>
      
      <div className="mt-4 p-3 bg-primary border-2 border-accent-danger rounded-lg">
        <p className="text-sm text-accent-danger font-semibold">Orbit Status</p>
        <p className="text-lg text-primary">{state.orbit || "Unknown"}</p>
      </div>
    </div>
  )
}

// Detective Mystery State
function renderDetectiveState(state: Record<string, any>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Evidence" value={state.evidence || 0} icon="📋" />
        <StatCard label="Suspects" value={state.suspects || 0} icon="🕵️" />
        <StatCard label="Leads" value={state.leads || 0} icon="🔍" />
        <StatCard label="Time Left" value={`${state.time || 0}h`} icon="⏰" />
      </div>
      
      <StatBar label="Reputation" value={state.reputation || 50} max={100} color="purple" />
      
      <div className="mt-4 p-3 bg-primary border-2 border-light rounded-lg">
        <p className="text-sm text-secondary">Current Location</p>
        <p className="text-lg font-semibold text-primary">{state.location || "Unknown"}</p>
      </div>
    </div>
  )
}

// Generic State (fallback)
function renderGenericState(state: Record<string, any>) {
  return (
    <div className="space-y-2">
      {Object.entries(state).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center p-2 bg-primary border-2 border-light rounded">
          <span className="text-sm text-secondary capitalize">{key}</span>
          <span className="text-sm font-semibold text-primary">{String(value)}</span>
        </div>
      ))}
    </div>
  )
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
    red: "bg-accent-danger",
    yellow: "bg-accent-warning",
    green: "bg-accent-success",
    blue: "bg-accent-primary",
    purple: "bg-accent-info",
    cyan: "bg-accent-primary",
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-secondary">{label}</span>
        <span className="text-sm font-semibold text-primary">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-secondary border-2 border-light rounded-full h-2">
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
    <div className="p-3 bg-primary border-2 border-light rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-secondary uppercase">{label}</p>
      </div>
      <p className="text-xl font-bold text-primary">{value}</p>
    </div>
  )
}
