"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type LessonStep = {
  title: string
  lesson: string[]
  exampleCode?: string
  exerciseTitle: string
  exercisePrompt: string
}

export type LessonContentProps = {
  stepIndex: number
  totalSteps: number
  step: LessonStep
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  children: React.ReactNode
}

export function LessonContent({
  stepIndex,
  totalSteps,
  step,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  children,
}: LessonContentProps) {
  const stepNumber = stepIndex + 1

  return (
    <section className={componentCardClassName}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#6E6E73]">
            LESSON CONTENT
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#1D1D1F]">
            📖 Step {stepNumber}: {step.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>
          <Button size="sm" onClick={onNext} disabled={!canGoNext}>
            Next
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm text-[#1D1D1F]">
        {step.lesson.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {step.exampleCode && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-[#6E6E73]">Example</div>
          <pre
            className={cn(
              "mt-2 overflow-x-auto rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4",
              "text-sm text-[#1D1D1F]"
            )}
          >
            <code className="font-mono">{step.exampleCode}</code>
          </pre>
        </div>
      )}

      <div className="mt-6">
        <div className="text-xs font-semibold text-[#6E6E73]">✅ {step.exerciseTitle}</div>
        <div className="mt-2 text-sm text-[#1D1D1F]">{step.exercisePrompt}</div>

        <div className="mt-4">{children}</div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-[#6E6E73]">
        <div>
          Step {stepNumber} / {totalSteps}
        </div>
        <div className="font-medium">Keep going — small steps add up.</div>
      </div>
    </section>
  )
}
