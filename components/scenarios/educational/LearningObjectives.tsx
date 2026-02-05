"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type LearningObjectivesProps = {
  objectives: string[]
  defaultOpen?: boolean
}

export function LearningObjectives({
  objectives,
  defaultOpen = true,
}: LearningObjectivesProps) {
  if (objectives.length === 0) return null

  return (
    <section className={componentCardClassName}>
      <details open={defaultOpen}>
        <summary
          className={cn(
            "cursor-pointer select-none text-xl font-bold text-[#1D1D1F]",
            "marker:text-[#6E6E73]"
          )}
        >
          💡 Learning Objectives
        </summary>

        <div className="mt-4 text-sm text-[#1D1D1F]">
          <div className="text-[#6E6E73]">
            By the end of this lesson, you’ll understand:
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  )
}
