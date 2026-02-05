"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { Scenario } from "@/lib/scenarios"

export function SimulationBriefing({ scenario }: { scenario: Scenario }) {
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
              <h3 className="text-xl font-bold">Space Station Emergency Simulation</h3>
              <div className="mt-1 text-sm text-[#6E6E73]">
                You are the emergency response coordinator.
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#1D1D1F]">{scenario.description}</p>
        </div>

        <div className="hidden w-[280px] shrink-0 md:block">
          <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
            <div className="text-xs font-semibold text-[#6E6E73]">Mission control</div>
            <div className="mt-2 text-sm font-semibold text-[#1D1D1F]">
              “Commander, multiple systems are failing. Awaiting your orders.”
            </div>
            <div className="mt-3 text-xs text-[#6E6E73]">Confirm priorities before executing.</div>
          </div>
        </div>
      </div>

      <details className="mt-6 rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
        <summary className="cursor-pointer select-none text-sm font-bold text-[#1D1D1F]">
          ⚠️ Simulation briefing & rules
        </summary>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold text-[#6E6E73]">Situation</div>
            <ul className="mt-2 space-y-2 text-sm text-[#1D1D1F]">
              <li>• Multiple systems failing on Mars Colony Alpha</li>
              <li>• Crew of 6 depends on your decisions</li>
              <li>• Resupply arrives in 14 days</li>
              <li>• Prioritize life support and crew safety</li>
              <li>• Every decision has consequences</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#6E6E73]">Objectives</div>
            <ul className="mt-2 space-y-2 text-sm text-[#1D1D1F]">
              {objectives.slice(0, 6).map((objective) => (
                <li key={objective}>• {objective}</li>
              ))}
              {objectives.length === 0 && <li>• Stabilize critical systems</li>}
            </ul>
          </div>
        </div>
      </details>
    </section>
  )
}
