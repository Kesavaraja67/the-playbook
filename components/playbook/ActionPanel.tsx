"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ActionPanelProps {
  actions: string[]
  onActionClick: (action: string) => void
}

/**
 * ActionPanel - GENERATIVE COMPONENT
 * 
 * This component displays AI-suggested actions based on the current context.
 * In production, this would use Tambo's useTamboSuggestions hook.
 */
export function ActionPanel({ actions, onActionClick }: ActionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 uppercase tracking-wide hover:text-slate-300 transition-colors"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <span>Suggested Actions</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pt-1">
              {actions.map((action, index) => (
                <motion.div
                  key={action}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-1.5 px-2.5 text-xs border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all"
                    onClick={() => onActionClick(action)}
                  >
                    <span className="text-cyan-400 mr-1.5 text-[10px]">▸</span>
                    <span className="text-slate-200 leading-tight">{action}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
