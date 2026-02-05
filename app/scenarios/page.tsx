"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { scenarios, getDifficultyColor } from "@/lib/scenarios"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function ScenariosPage() {
  const router = useRouter()
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false)

  useEffect(() => {
    try {
      const shouldShow = window.sessionStorage.getItem("playbook:transition") === "1"
      if (!shouldShow) return

      window.sessionStorage.removeItem("playbook:transition")
      setShowTransitionOverlay(true)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const handleSelectScenario = (scenarioId: string) => {
    router.push(`/play?scenario=${scenarioId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--void-dark)] via-[var(--space-blue)] to-[var(--nebula-purple)] p-8 relative overflow-hidden">
      <AnimatePresence>
        {showTransitionOverlay && (
          <motion.div
            key="enter"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white"
            onAnimationComplete={() => setShowTransitionOverlay(false)}
          />
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--electric-cyan)] opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--plasma-purple)] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto mb-16 text-center relative z-10"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
          animate={{
            textShadow: [
              "0 0 20px rgba(0, 240, 255, 0.5)",
              "0 0 40px rgba(181, 55, 242, 0.5)",
              "0 0 20px rgba(0, 240, 255, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Choose Your Reality
        </motion.h1>
        <p 
          className="text-xl text-slate-300 max-w-2xl mx-auto"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Select a scenario to begin your simulation. Each reality presents unique challenges,
          objectives, and outcomes powered by AI.
        </p>
      </motion.div>

      {/* Scenario Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              z: 50
            }}
            style={{ perspective: 1000 }}
          >
            <Card
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 holographic-border glass-strong group`}
              onClick={() => handleSelectScenario(scenario.id)}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative p-8 h-full">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.span 
                      className="text-5xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {scenario.icon}
                    </motion.span>
                    <div>
                      <h2 
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        {scenario.title}
                      </h2>
                      <Badge 
                        variant={scenario.difficulty === "extreme" ? "destructive" : "secondary"}
                        className={`${getDifficultyColor(scenario.difficulty)} uppercase text-xs glow-cyan`}
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p 
                  className="text-slate-300 mb-6 leading-relaxed"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {scenario.description}
                </p>

                {/* Objectives */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--electric-cyan)" }}>
                    Objectives
                  </h3>
                  <ul className="space-y-1">
                    {scenario.objectives.slice(0, 3).map((objective, i) => (
                      <motion.li 
                        key={i} 
                        className="text-sm text-slate-400 flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                      >
                        <span style={{ color: "var(--electric-cyan)" }}>▸</span>
                        {objective}
                      </motion.li>
                    ))}
                    {scenario.objectives.length > 3 && (
                      <li className="text-sm text-slate-500 italic">
                        +{scenario.objectives.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Hover Indicator */}
                <div className="mt-6 text-right">
                  <motion.span 
                    className="text-sm font-semibold"
                    style={{ color: "var(--electric-cyan)" }}
                    animate={{
                      x: [0, 5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Click to Begin →
                  </motion.span>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none glow-cyan" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Canvas Demo Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto mt-12 text-center relative z-10"
      >
        <button
          onClick={() => router.push("/canvas-demo")}
          className="glass px-6 py-3 rounded-lg text-white hover:glow-cyan transition-all mb-4"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          🎨 View Canvas Components Demo
        </button>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto mt-4 text-center relative z-10"
      >
        <button
          onClick={() => router.push("/")}
          className="text-slate-400 hover:text-[var(--electric-cyan)] transition-colors"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          ← Back to Portal
        </button>
      </motion.div>
    </div>
  )
}
