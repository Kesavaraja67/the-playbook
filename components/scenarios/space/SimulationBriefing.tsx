"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { Scenario } from "@/lib/scenarios"

export function SimulationBriefing({ scenario }: { scenario: Scenario }) {
  const shouldReduceMotion = useReducedMotion()
  const [isBriefingOpen, setIsBriefingOpen] = React.useState(false)
  const objectives = scenario.objectives ?? []

  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-4xl" aria-hidden>
              🚀
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary">
                Space Station Emergency Simulation
              </h3>
              <div className="mt-1 text-sm text-text-secondary">
                You are the emergency response coordinator.
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-text-primary">{scenario.description}</p>
        </div>

        <div className="hidden w-[280px] shrink-0 md:block">
          <div className="rounded-xl border border-light bg-bg-secondary p-4 shadow-sm">
            <div className="text-xs font-semibold text-text-secondary">Mission control</div>
            <div className="mt-2 text-sm font-semibold text-text-primary">
              “Commander, multiple systems are failing. Awaiting your orders.”
            </div>
            <div className="mt-3 text-xs text-text-secondary">
              Confirm priorities before executing.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-light bg-tertiary p-4 shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-text-primary"
          aria-expanded={isBriefingOpen}
          onClick={() => setIsBriefingOpen((prev) => !prev)}
        >
          <span>⚠️ Simulation briefing & rules</span>
          <motion.span
            aria-hidden
            animate={{ rotate: isBriefingOpen ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="inline-flex size-9 items-center justify-center rounded-full border border-light bg-bg-secondary text-text-secondary"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isBriefingOpen ? (
            <motion.div
              key="briefing"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-text-secondary">Situation</div>
                  <ul className="mt-2 space-y-2 text-sm text-text-primary">
                    <li>• Multiple systems failing on Mars Colony Alpha</li>
                    <li>• Crew of 6 depends on your decisions</li>
                    <li>• Resupply arrives in 14 days</li>
                    <li>• Prioritize life support and crew safety</li>
                    <li>• Every decision has consequences</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold text-text-secondary">Objectives</div>
                  <ul className="mt-2 space-y-2 text-sm text-text-primary">
                    {objectives.slice(0, 6).map((objective) => (
                      <li key={objective}>• {objective}</li>
                    ))}
                    {objectives.length === 0 && <li>• Stabilize critical systems</li>}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
