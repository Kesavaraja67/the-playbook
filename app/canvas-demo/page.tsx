"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GameBoard, ResourceMeter, ActionMatrix, DiscoveryCard, TacticalAlert, ProgressTracker } from "@/components/canvas"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

/**
 * Canvas Demo Page
 * 
 * Showcases all Reality Forge V4.0 canvas components
 * with sample data and interactions
 */
export default function CanvasDemoPage() {
  const [showDiscovery, setShowDiscovery] = useState(false)

  // Sample data
  const sampleResources = [
    { name: "Health", value: 85, color: "var(--accent-success)", icon: "❤️" },
    { name: "Ammo", value: 45, color: "var(--accent-warning)", icon: "🔫" },
    { name: "Food", value: 25, color: "var(--accent-danger)", icon: "🍖" },
  ]

  const sampleActions = [
    {
      id: "scavenge",
      label: "Scavenge",
      icon: "🔍",
      costs: [{ resource: "Energy", amount: 10 }],
      successRate: 75,
      description: "Search for supplies"
    },
    {
      id: "fortify",
      label: "Fortify",
      icon: "🛡️",
      costs: [{ resource: "Materials", amount: 20 }],
      successRate: 90,
      description: "Strengthen defenses"
    },
    {
      id: "move",
      label: "Move",
      icon: "🏃",
      costs: [{ resource: "Energy", amount: 15 }],
      successRate: 60,
      description: "Change location"
    },
    {
      id: "rest",
      label: "Rest",
      icon: "😴",
      successRate: 100,
      description: "Recover energy"
    }
  ]

  const sampleMilestones = [
    { id: "1", title: "Find Shelter", status: "completed" as const },
    { id: "2", title: "Secure Resources", status: "active" as const, progress: 65 },
    { id: "3", title: "Build Defenses", status: "locked" as const },
    { id: "4", title: "Survive 7 Days", status: "locked" as const }
  ]

  return (
    <div className="min-h-screen bg-secondary p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1
                className="text-3xl font-bold text-primary"
              >
                Reality Forge Canvas Demo
              </h1>
              <p className="text-sm text-secondary mt-1">
                Showcasing generative UI components
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GameBoard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-primary mb-3">
            GameBoard Component
          </h2>
          <GameBoard
            playerPosition={{ x: 250, y: 250 }}
            zombieLocations={[
              { x: 180, y: 200 },
              { x: 320, y: 280 },
              { x: 150, y: 350 }
            ]}
            resourcePoints={[
              { x: 400, y: 150 },
              { x: 100, y: 400 }
            ]}
            theme="apocalyptic"
          />
        </motion.div>

        {/* ResourceMeter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-primary mb-3">
            ResourceMeter Component
          </h2>
          <ResourceMeter resources={sampleResources} />
        </motion.div>

        {/* ActionMatrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-primary mb-3">
            ActionMatrix Component
          </h2>
          <ActionMatrix
            actions={sampleActions}
            onActionClick={(id) => {
              console.log("Action clicked:", id)
              if (id === "scavenge") {
                setShowDiscovery(true)
                setTimeout(() => setShowDiscovery(false), 3000)
              }
            }}
          />
        </motion.div>

        {/* ProgressTracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-primary mb-3">
            ProgressTracker Component
          </h2>
          <ProgressTracker milestones={sampleMilestones} />
        </motion.div>

        {/* TacticalAlert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-primary mb-3">
            TacticalAlert Component
          </h2>
          <TacticalAlert
            type="warning"
            title="Resource Low"
            message="Food supplies are running critically low. Consider scavenging nearby areas."
            priority="medium"
          />
          <TacticalAlert
            type="danger"
            title="Incoming Threat"
            message="Zombie horde detected 50m away. Prepare for combat or evacuation."
            priority="critical"
          />
        </motion.div>

        {/* DiscoveryCard (conditional) */}
        {showDiscovery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-primary mb-3">
              DiscoveryCard Component
            </h2>
            <DiscoveryCard
              item="Medical Kit"
              quantity={2}
              rarity="rare"
              animation="sparkle"
              icon="🏥"
            />
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="ds-card p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Component Features
          </h3>
          <ul className="text-sm text-secondary space-y-2">
            <li>✨ <strong>GameBoard:</strong> Interactive SVG map with animated player, enemies, and resources</li>
            <li>✨ <strong>ResourceMeter:</strong> Circular gauges with color-coded status indicators</li>
            <li>✨ <strong>ActionMatrix:</strong> Interactive action cards with costs and success rates</li>
            <li>✨ <strong>ProgressTracker:</strong> Timeline visualization with milestone states</li>
            <li>✨ <strong>TacticalAlert:</strong> Priority-based notifications with pulse animations</li>
            <li>✨ <strong>DiscoveryCard:</strong> Animated item reveals (click &quot;Scavenge&quot; to trigger)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
