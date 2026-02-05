"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  CategoryFilter,
  type ScenarioCategoryFilter,
} from "@/components/scenarios/CategoryFilter"
import { ScenarioCard } from "@/components/scenarios/ScenarioCard"
import { scenarios } from "@/lib/scenarios"
import { consumePlaybookTransitionFlag } from "@/lib/transitionOverlay"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function ScenariosPage() {
  const router = useRouter()
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(() =>
    consumePlaybookTransitionFlag(),
  )

  const [category, setCategory] = useState<ScenarioCategoryFilter>("all")

  const filteredScenarios = useMemo(() => {
    if (category === "all") return scenarios
    return scenarios.filter((scenario) => scenario.category === category)
  }, [category])

  const handleSelectScenario = (scenarioId: string) => {
    router.push(`/play?scenario=${scenarioId}`)
  }

  const handleCategoryChange = (nextCategory: ScenarioCategoryFilter) => {
    setCategory(nextCategory)
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.push("/")
      return
    }

    router.back()
  }

  return (
    <div className={`${inter.className} min-h-screen bg-[#F5F5F7] px-6 py-8`}>
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

      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-[14px] font-bold tracking-[0.28em] text-[#1D1D1F]"
          >
            THE PLAYBOOK
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="text-[14px] font-semibold text-[#1D1D1F] transition-colors hover:text-[#0071E3]"
          >
            ← Back
          </button>
        </header>

        <div className="py-14 text-center">
          <h1 className="text-4xl font-bold text-[#1D1D1F] md:text-6xl">
            Choose Your Reality
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-[#6E6E73]">
            Pick a scenario to begin. Filter by category, then jump straight into play.
          </p>

          <div className="mt-10">
            <CategoryFilter value={category} onChange={handleCategoryChange} />
          </div>
        </div>

        <main>
          <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                description={scenario.description}
                category={scenario.category}
                tags={scenario.tags}
                onClick={() => handleSelectScenario(scenario.id)}
              />
            ))}
          </div>

          {filteredScenarios.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[16px] font-medium text-[#6E6E73]">
                No scenarios in this category yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
