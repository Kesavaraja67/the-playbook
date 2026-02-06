"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"

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
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const shouldReduceMotion = useReducedMotion()

  if (objectives.length === 0) return null

  return (
    <section className={componentCardClassName}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between gap-4 text-left",
          "cursor-pointer select-none text-xl font-semibold text-text-primary"
        )}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>💡 Learning Objectives</span>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex size-9 items-center justify-center rounded-full border border-light bg-bg-secondary text-text-secondary"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-sm text-text-primary">
              <div className="text-text-secondary">By the end of this lesson, you’ll understand:</div>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
