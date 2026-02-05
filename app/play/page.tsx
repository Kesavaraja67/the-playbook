"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getScenarioById } from "@/lib/scenarios"
import { ComponentStack } from "@/components/playbook/ComponentStack"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Send, ArrowLeft, Maximize2, Minimize2 } from "lucide-react"
import {
  GameBoard,
  ResourceMeter,
  TacticalAlert,
  ProgressTracker,
  NegotiationDashboard,
  SpaceStationControl,
  DetectiveBoard
} from "@/components/canvas"

function PlayPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const scenarioId = searchParams.get("scenario") || "zombie-survival"
  const scenario = getScenarioById(scenarioId)

  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>(
    scenario ? [
      {
        role: "assistant",
        content: `Welcome to **${scenario.title}**!\n\n${scenario.description}\n\nYour objectives are clear. What will you do first?`,
      },
    ] : []
  )
  const [input, setInput] = useState("")
  const [canvasComponents, setCanvasComponents] = useState<Array<{
    id: string
    type: string
    component: React.ReactNode
    timestamp: number
  }>>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const addInitialComponents = useCallback((scenarioId: string) => {
    const timestamp = Date.now()
    
    switch (scenarioId) {
      case "zombie-survival":
        setCanvasComponents([
          {
            id: `comp-${timestamp}`,
            type: "GameBoard",
            component: (
              <GameBoard
                playerPosition={{ x: 250, y: 250 }}
                zombieLocations={[
                  { x: 180, y: 200 },
                  { x: 320, y: 280 }
                ]}
                resourcePoints={[{ x: 400, y: 150 }]}
                theme="apocalyptic"
              />
            ),
            timestamp
          },
          {
            id: `comp-${timestamp + 1}`,
            type: "ResourceMeter",
            component: (
              <ResourceMeter
                resources={[
                  { name: "Health", value: 85, color: "var(--electric-cyan)", icon: "❤️" },
                  { name: "Ammo", value: 45, color: "var(--quantum-gold)", icon: "🔫" },
                  { name: "Food", value: 25, color: "var(--warning-amber)", icon: "🍖" }
                ]}
              />
            ),
            timestamp: timestamp + 1
          }
        ])
        break

      case "salary-negotiation":
        setCanvasComponents([
          {
            id: `comp-${timestamp}`,
            type: "NegotiationDashboard",
            component: (
              <NegotiationDashboard
                currentOffer={85000}
                targetSalary={100000}
                marketRate={95000}
                leveragePoints={[
                  { title: "Specialized Skills", description: "Rare expertise in AI/ML", value: 15 },
                  { title: "Market Demand", description: "High demand for your role", value: 10 }
                ]}
                relationshipScore={65}
              />
            ),
            timestamp
          }
        ])
        break

      case "space-station":
        setCanvasComponents([
          {
            id: `comp-${timestamp}`,
            type: "SpaceStationControl",
            component: (
              <SpaceStationControl
                systems={[
                  { id: "oxygen", name: "O₂ Recycler", status: "warning", priority: "high", icon: "💨", repairCost: 20 },
                  { id: "power", name: "Power Grid", status: "operational", priority: "low", icon: "⚡" },
                  { id: "comms", name: "Communications", status: "failing", priority: "critical", icon: "📡", repairCost: 30 },
                  { id: "life", name: "Life Support", status: "operational", priority: "low", icon: "🛡️" }
                ]}
                resources={[
                  { name: "Oxygen", level: 75, color: "var(--electric-cyan)", icon: <span>💨</span> },
                  { name: "Power", level: 60, color: "var(--quantum-gold)", icon: <span>⚡</span> },
                  { name: "Water", level: 40, color: "var(--frost-blue)", icon: <span>💧</span> }
                ]}
                daysLeft={7}
              />
            ),
            timestamp
          }
        ])
        break

      case "detective-mystery":
        setCanvasComponents([
          {
            id: `comp-${timestamp}`,
            type: "DetectiveBoard",
            component: (
              <DetectiveBoard
                suspects={[
                  { id: "1", name: "John Smith", alibi: "Was at home watching TV", suspicionLevel: 75, connections: ["Victim", "Crime Scene"] },
                  { id: "2", name: "Jane Doe", alibi: "Working late at office", suspicionLevel: 45, connections: ["Victim"] }
                ]}
                evidence={[
                  { id: "1", type: "physical", description: "Fingerprints on weapon", location: "Crime Scene", timestamp: "10:30 PM" },
                  { id: "2", type: "testimony", description: "Witness saw suspect fleeing", location: "Street", timestamp: "10:45 PM" }
                ]}
                timeline={[
                  { time: "10:00 PM", event: "Victim last seen alive", verified: true },
                  { time: "10:30 PM", event: "Estimated time of death", verified: true },
                  { time: "10:45 PM", event: "Suspect spotted nearby", verified: false }
                ]}
              />
            ),
            timestamp
          }
        ])
        break
    }
  }, [setCanvasComponents])

  useEffect(() => {
    if (scenario) {
      // Add initial canvas components based on scenario
      setTimeout(() => {
        addInitialComponents(scenarioId)
      }, 1000)
    }
  }, [scenario, scenarioId, addInitialComponents])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response and component generation
    setTimeout(() => {
      const aiResponse = generateMockResponse(input, scenarioId)
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
      
      // Randomly generate new canvas components
      if (Math.random() > 0.6) {
        generateCanvasComponent(scenarioId, input)
      }
    }, 1000)
  }

  const generateCanvasComponent = (scenarioId: string, userInput: string) => {
    const timestamp = Date.now()
    
    // Example: Generate components based on user actions
    if (userInput.toLowerCase().includes("alert") || userInput.toLowerCase().includes("warning")) {
      setCanvasComponents(prev => [{
        id: `comp-${timestamp}`,
        type: "TacticalAlert",
        component: (
          <TacticalAlert
            type="warning"
            title="New Development"
            message="The situation has changed. Adjust your strategy accordingly."
            priority="medium"
          />
        ),
        timestamp
      }, ...prev])
    } else if (userInput.toLowerCase().includes("progress") || userInput.toLowerCase().includes("objective")) {
      setCanvasComponents(prev => [{
        id: `comp-${timestamp}`,
        type: "ProgressTracker",
        component: (
          <ProgressTracker
            milestones={[
              { id: "1", title: "Initial Setup", status: "completed" },
              { id: "2", title: "Current Objective", status: "active", progress: 60 },
              { id: "3", title: "Final Goal", status: "locked" }
            ]}
          />
        ),
        timestamp
      }, ...prev])
    }
  }

  const handleRemoveComponent = (id: string) => {
    setCanvasComponents(prev => prev.filter(comp => comp.id !== id))
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Scenario not found</h1>
          <Button onClick={() => router.push("/scenarios")}>
            Back to Scenarios
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--void-dark)] via-[var(--space-blue)] to-[var(--nebula-purple)] flex">
      {/* Sidebar - Scenario Info & Chat */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0, width: sidebarCollapsed ? "60px" : "380px" }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 border-r border-slate-700 glass-strong flex flex-col relative"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 -right-3 z-10 w-6 h-6 rounded-full bg-cyan-600 hover:bg-cyan-700 flex items-center justify-center text-white"
        >
          {sidebarCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
        </button>

        {!sidebarCollapsed && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/scenarios")}
                className="text-slate-400 hover:text-white mb-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{scenario.icon}</span>
                <div>
                  <h1 
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {scenario.title}
                  </h1>
                  <p className="text-xs text-slate-400">Live Simulation</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-cyan-900/50 text-white"
                        : "bg-slate-800/50 text-slate-200"
                    }`}
                  >
                    <p className="text-xs whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your action..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Button onClick={handleSendMessage} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {sidebarCollapsed && (
          <div className="flex flex-col items-center py-4 gap-4">
            <span className="text-2xl">{scenario.icon}</span>
          </div>
        )}
      </motion.div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <ComponentStack
            components={canvasComponents}
            onRemove={handleRemoveComponent}
          />
        </div>
      </div>
    </div>
  )
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <PlayPageContent />
    </Suspense>
  )
}

// Mock response generator
function generateMockResponse(input: string, scenarioId: string): string {
  const responses: Record<string, string[]> = {
    "zombie-survival": [
      "You cautiously move forward. The sound of shuffling feet echoes nearby.",
      "You find supplies in an abandoned store. Resources updated.",
      "A group of zombies spots you! Quick decision needed.",
    ],
    "salary-negotiation": [
      "The hiring manager listens carefully. They seem impressed.",
      "They counter with a slightly higher offer. Progress is being made.",
      "You've built strong rapport. They're open to discussing benefits.",
    ],
    "space-station": [
      "You access the diagnostic panel. Multiple warnings detected.",
      "The oxygen recycler is failing faster than expected.",
      "Mission control acknowledges your status.",
    ],
    "detective-mystery": [
      "You examine the evidence carefully. A pattern emerges.",
      "The suspect's alibi doesn't add up. Further investigation needed.",
      "You discover crucial evidence that changes everything.",
    ],
  }

  const scenarioResponses = responses[scenarioId] || responses["zombie-survival"]
  return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)]
}
