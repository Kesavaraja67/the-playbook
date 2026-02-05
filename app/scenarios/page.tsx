"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { scenarios, getDifficultyColor } from "@/lib/scenarios"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ScenariosPage() {
  const router = useRouter()

  const handleSelectScenario = (scenarioId: string) => {
    router.push(`/play?scenario=${scenarioId}`)
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-primary text-center">
          Choose your scenario
        </h1>
        <p className="mt-4 text-secondary text-center max-w-2xl mx-auto">
          Pick a scenario to start. Each one has clear objectives and different
          constraints.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => handleSelectScenario(scenario.id)}
            >
              <div className="px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl leading-none">{scenario.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-primary">
                        {scenario.title}
                      </h2>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(scenario.difficulty)} mt-2`}
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-secondary leading-relaxed">
                  {scenario.description}
                </p>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-tertiary">
                    Objectives
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {scenario.objectives.slice(0, 3).map((objective) => (
                      <li
                        key={objective}
                        className="text-sm text-secondary flex items-start gap-2"
                      >
                        <span className="text-accent-primary">▸</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                    {scenario.objectives.length > 3 && (
                      <li className="text-sm text-tertiary">
                        +{scenario.objectives.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-6 text-right">
                  <span className="text-sm font-semibold text-accent-primary">
                    Click to begin →
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-12 flex flex-col items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/canvas-demo")}
        >
          View canvas components demo
        </Button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-secondary hover:text-accent-primary underline-offset-4 hover:underline"
        >
          Back to portal
        </button>
      </div>
    </div>
  )
}
