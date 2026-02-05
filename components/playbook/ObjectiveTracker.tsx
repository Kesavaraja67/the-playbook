"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Lock } from "lucide-react"

interface Objective {
  id: string
  text: string
  status: "locked" | "active" | "completed"
  progress?: number
}

interface ObjectiveTrackerProps {
  objectives: Objective[]
  scenarioTitle: string
}

/**
 * ObjectiveTracker - GENERATIVE COMPONENT
 * 
 * This component displays AI-generated objectives for the current scenario.
 * Objectives update dynamically based on game state and player progress.
 */
export function ObjectiveTracker({ objectives, scenarioTitle }: ObjectiveTrackerProps) {
  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 
          className="text-2xl font-bold text-primary mb-2"
        >
          Objectives
        </h2>
        <p className="text-sm text-secondary mb-6">{scenarioTitle}</p>

        <div className="space-y-4">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ObjectiveItem objective={objective} />
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-6 border-t-2 border-medium">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-secondary">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">
              {objectives.filter(o => o.status === "completed").length} / {objectives.length}
            </span>
          </div>
          <Progress 
            value={(objectives.filter(o => o.status === "completed").length / objectives.length) * 100} 
            className="h-2"
          />
        </div>
      </motion.div>
    </Card>
  )
}

function ObjectiveItem({ objective }: { objective: Objective }) {
  const getIcon = () => {
    switch (objective.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-accent-success" />
      case "active":
        return <Circle className="w-5 h-5 text-accent-primary" />
      case "locked":
        return <Lock className="w-5 h-5 text-tertiary" />
    }
  }

  const getTextColor = () => {
    switch (objective.status) {
      case "completed":
        return "text-tertiary line-through"
      case "active":
        return "text-primary"
      case "locked":
        return "text-tertiary"
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary border-2 border-light hover:border-medium transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className={`text-sm ${getTextColor()}`}>
          {objective.text}
        </p>
        {objective.status === "active" && objective.progress !== undefined && (
          <div className="mt-2">
            <Progress value={objective.progress} className="h-1" />
          </div>
        )}
      </div>
      {objective.status === "active" && (
        <Badge variant="outline" className="text-xs border-accent-primary text-accent-primary">
          Active
        </Badge>
      )}
    </div>
  )
}
