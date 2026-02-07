"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { CategoryFilter, type ScenarioCategoryFilter } from "@/components/scenarios/CategoryFilter"
import { ScenarioCard } from "@/components/scenarios/ScenarioCard"
import { scenarios, type Scenario } from "@/lib/scenarios"
import { consumePlaybookTransitionFlag } from "@/lib/transitionOverlay"

const defaultEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const gridItemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: defaultEase,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: defaultEase,
    },
  },
}

export default function ScenariosPage() {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const [showTransitionOverlay, setShowTransitionOverlay] = useState(() =>
    consumePlaybookTransitionFlag(),
  )
  const [category, setCategory] = useState<ScenarioCategoryFilter>("all")
  const [pendingScenario, setPendingScenario] = useState<Scenario | null>(null)

  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActiveRef = useRef(true)

  useEffect(() => {
    isActiveRef.current = true
    router.prefetch("/play")

    return () => {
      isActiveRef.current = false
      if (navTimeoutRef.current === null) return
      clearTimeout(navTimeoutRef.current)
    }
  }, [router])

  const filteredScenarios = useMemo(() => {
    if (category === "all") return scenarios
    return scenarios.filter((scenario) => scenario.category === category)
  }, [category])

  const handleSelectScenario = (scenario: Scenario) => {
    if (pendingScenario) return
    setPendingScenario(scenario)

    const delayMs = shouldReduceMotion ? 0 : 380
    navTimeoutRef.current = setTimeout(() => {
      if (!isActiveRef.current) return
      router.push(`/play?scenario=${scenario.id}`)
    }, delayMs)
  }

  const handleBack = () => {
    if (pendingScenario) return
    router.push("/")
  }

  return (
    <div className="min-h-dvh bg-bg-secondary px-6 py-8 text-text-primary">
      <AnimatePresence>
        {showTransitionOverlay && (
          <motion.div
            key="enter"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: defaultEase }}
            className="fixed inset-0 z-50 bg-bg-primary"
            onAnimationComplete={() => setShowTransitionOverlay(false)}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: defaultEase }}
          className="flex items-center justify-between"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-[13px] font-semibold tracking-[0.28em] text-text-primary transition-colors hover:text-accent-primary"
          >
            THE PLAYBOOK
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={Boolean(pendingScenario)}
            className="text-[14px] font-medium text-text-secondary transition-colors hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            ← Back
          </button>
        </motion.header>

        <div className="py-14 text-center">
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: defaultEase }}
            className="text-4xl font-semibold tracking-tight text-text-primary md:text-6xl"
          >
            Choose Your Reality
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: defaultEase,
              delay: 0.05,
            }}
            className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary"
          >
            Pick a scenario to begin. Filter by category, then jump straight into play.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: defaultEase,
              delay: 0.1,
            }}
            className="mt-10"
          >
            <CategoryFilter value={category} onChange={setCategory} />
          </motion.div>
        </div>

        <main>
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredScenarios.map((scenario) => {
                const isSelected = pendingScenario?.id === scenario.id
                const isDimmed = Boolean(pendingScenario) && !isSelected

                return (
                  <motion.div
                    key={scenario.id}
                    variants={gridItemVariants}
                    layout
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : isDimmed
                          ? { opacity: 0, scale: 0.96, filter: "blur(2px)" }
                          : isSelected
                            ? { scale: 1.03 }
                            : { opacity: 1, scale: 1, filter: "blur(0px)" }
                    }
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: defaultEase }}
                  >
                    <ScenarioCard
                      title={scenario.title}
                      description={scenario.description}
                      category={scenario.category}
                      tags={scenario.tags}
                      disabled={Boolean(pendingScenario)}
                      onClick={() => handleSelectScenario(scenario)}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {filteredScenarios.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[16px] font-medium text-text-secondary">
                No scenarios in this category yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
