"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  CategoryFilter,
  type ScenarioCategoryFilter,
} from "@/components/scenarios/CategoryFilter"
import { ScenarioCard } from "@/components/scenarios/ScenarioCard"
import { scenarios, type Scenario } from "@/lib/scenarios"
import { consumePlaybookTransitionFlag } from "@/lib/transitionOverlay"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const easeOut = [0.4, 0, 0.2, 1] as const
const easeIn = [0.4, 0, 1, 1] as const

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
}

const gridItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: easeIn,
    },
  },
}

export default function ScenariosPage() {
  const router = useRouter()
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(() =>
    consumePlaybookTransitionFlag(),
  )

  const [pendingScenario, setPendingScenario] = useState<Scenario | null>(null)
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current === null) return
      clearTimeout(navTimeoutRef.current)
    }
  }, [])

  const [category, setCategory] = useState<ScenarioCategoryFilter>("all")

  const filteredScenarios = useMemo(() => {
    if (category === "all") return scenarios
    return scenarios.filter((scenario) => scenario.category === category)
  }, [category])

  const handleSelectScenario = (scenario: Scenario) => {
    if (pendingScenario) return
    setPendingScenario(scenario)

    navTimeoutRef.current = setTimeout(() => {
      router.push(`/play?scenario=${scenario.id}`)
    }, 520)
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
    <div className={`${inter.className} min-h-screen bg-[#F5F5F7] px-6 py-8 app-ambient`}>
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

        {pendingScenario && (
          <motion.div
            key="scenario-select"
            className="fixed inset-0 z-50 grid place-items-center bg-[#F5F5F7] px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="w-full max-w-md"
            >
              <div className="ds-card p-8 text-center">
                <div className="text-sm font-semibold text-[#6E6E73]">Entering</div>
                <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{pendingScenario.title}</div>
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                  <motion.div
                    className="h-full bg-[#0071E3]"
                    initial={{ width: "20%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, ease: easeOut }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl">
        <motion.header
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
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
        </motion.header>

        <motion.div
          className="py-14 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.05 }}
        >
          <h1 className="text-4xl font-bold text-[#1D1D1F] md:text-6xl">
            Choose Your Reality
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-[#6E6E73]">
            Pick a scenario to begin. Filter by category, then jump straight into play.
          </p>

          <div className="mt-10">
            <CategoryFilter value={category} onChange={handleCategoryChange} />
          </div>
        </motion.div>

        <motion.main
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            layout
            className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredScenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  layout
                  variants={gridItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ScenarioCard
                    title={scenario.title}
                    description={scenario.description}
                    category={scenario.category}
                    tags={scenario.tags}
                    onClick={() => handleSelectScenario(scenario)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredScenarios.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[16px] font-medium text-[#6E6E73]">
                No scenarios in this category yet.
              </p>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  )
}
