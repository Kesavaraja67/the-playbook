"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SystemStatus {
  id: string
  name: string
  status: "operational" | "warning" | "failing" | "critical"
  priority: "low" | "medium" | "high" | "critical"
  icon: string
  repairCost?: number
}

interface Resource {
  name: string
  level: number // 0-100
  color: string
  icon: React.ReactNode
}

interface SpaceStationControlProps {
  systems: SystemStatus[]
  resources: Resource[]
  daysLeft: number
  onRepairSystem?: (systemId: string) => void
}

/**
 * SpaceStationControl - SCENARIO-SPECIFIC CANVAS COMPONENT
 * 
 * For space station scenario:
 * - System status grid with repair options
 * - Liquid tank visualizations for resources
 * - Countdown timer
 * - Interactive repair buttons
 */
export function SpaceStationControl({
  systems,
  resources,
  daysLeft,
  onRepairSystem
}: SpaceStationControlProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ds-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold text-secondary uppercase tracking-wide"
        >
          Station Control Panel
        </h3>
        <CountdownTimer days={daysLeft} />
      </div>

      {/* System Status Grid */}
      <div className="space-y-3">
        <h4 className="text-xs text-tertiary uppercase tracking-wide">System Status</h4>
        <div className="grid grid-cols-2 gap-3">
          {systems.map((system, index) => (
            <SystemCard
              key={system.id}
              system={system}
              index={index}
              onRepair={onRepairSystem}
            />
          ))}
        </div>
      </div>

      {/* Resource Tanks */}
      <div className="space-y-3">
        <h4 className="text-xs text-tertiary uppercase tracking-wide">Resource Levels</h4>
        <div className="grid grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <LiquidTank
              key={resource.name}
              resource={resource}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SystemCard({
  system,
  index,
  onRepair
}: {
  system: SystemStatus
  index: number
  onRepair?: (systemId: string) => void
}) {
  const statusConfig = {
    operational: {
      border: "border-accent-success",
      text: "text-accent-success",
      icon: "✓"
    },
    warning: {
      border: "border-accent-warning",
      text: "text-accent-warning",
      icon: "⚠"
    },
    failing: {
      border: "border-accent-warning",
      text: "text-accent-warning",
      icon: "!"
    },
    critical: {
      border: "border-accent-danger",
      text: "text-accent-danger",
      icon: "✕"
    }
  }

  const config = statusConfig[system.status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-primary border-2 ${config.border} shadow-sm rounded-lg p-3`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{system.icon}</span>
          <div>
            <h5 className="text-sm font-semibold text-primary">{system.name}</h5>
            <span className={`text-xs ${config.text} uppercase font-semibold`}>
              {system.status}
            </span>
          </div>
        </div>
        <motion.span
          className={`text-lg ${config.text}`}
          animate={system.status === "critical" ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {config.icon}
        </motion.span>
      </div>

      {system.status !== "operational" && onRepair && (
        <Button
          size="sm"
          onClick={() => onRepair(system.id)}
          className="w-full mt-2 text-xs"
        >
          Repair {system.repairCost && `(${system.repairCost} power)`}
        </Button>
      )}
    </motion.div>
  )
}

function LiquidTank({
  resource,
  index
}: {
  resource: Resource
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-full h-32 bg-primary rounded-lg overflow-hidden border-2 border-medium">
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-lg"
          style={{
            background: resource.color,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${resource.level}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
        />

        {/* Level indicator */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-2xl font-bold text-primary">
            {resource.level}%
          </span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[25, 50, 75].map((line) => (
            <div
              key={line}
              className="absolute left-0 right-0 border-t-2 border-light"
              style={{ bottom: `${line}%` }}
            />
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2 mt-2">
        <span style={{ color: resource.color }}>{resource.icon}</span>
        <span className="text-xs text-secondary font-semibold">{resource.name}</span>
      </div>
    </motion.div>
  )
}

function CountdownTimer({ days }: { days: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg border-2 border-medium shadow-sm"
    >
      <Clock className="w-4 h-4 text-accent-primary" />
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {days}
        </div>
        <div className="text-[10px] text-tertiary uppercase">Days Left</div>
      </div>
    </motion.div>
  )
}
