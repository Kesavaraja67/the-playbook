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
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 
          className="text-2xl font-bold text-purple-400 mb-2 flex items-center gap-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
          Objectives
        </h2>
        <p className="text-sm text-slate-400 mb-6">{scenarioTitle}</p>

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
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-sm font-semibold text-white">
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
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "active":
        return <Circle className="w-5 h-5 text-cyan-500" />
      case "locked":
        return <Lock className="w-5 h-5 text-slate-600" />
    }
  }

  const getTextColor = () => {
    switch (objective.status) {
      case "completed":
        return "text-slate-500 line-through"
      case "active":
        return "text-white"
      case "locked":
        return "text-slate-600"
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
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
        <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
          Active
        </Badge>
      )}
    </div>
  )
}
