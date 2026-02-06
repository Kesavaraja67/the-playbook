"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type PlaygroundFeedback =
  | { state: "idle" }
  | { state: "correct"; message: string }
  | { state: "incorrect"; message: string }

export type CodePlaygroundProps = {
  code: string
  onCodeChange: (code: string) => void
  onCheckAnswer: () => void
  onGetHint: () => void
  feedback: PlaygroundFeedback
  hint?: string
  showHint: boolean
  disabled?: boolean
}

export function CodePlayground({
  code,
  onCodeChange,
  onCheckAnswer,
  onGetHint,
  feedback,
  hint,
  showHint,
  disabled,
}: CodePlaygroundProps) {
  const shouldReduceMotion = useReducedMotion()
  const feedbackColors =
    feedback.state === "correct"
      ? { borderColor: "rgba(16,185,129,0.35)", backgroundColor: "rgba(16,185,129,0.08)" }
      : feedback.state === "incorrect"
        ? { borderColor: "rgba(239,68,68,0.35)", backgroundColor: "rgba(239,68,68,0.08)" }
        : { borderColor: "var(--border-light)", backgroundColor: "var(--bg-tertiary)" }

  return (
    <div>
      <motion.div
        className={cn("rounded-xl border p-4 shadow-md")}
        style={feedbackColors}
        animate={
          shouldReduceMotion
            ? undefined
            : feedback.state === "incorrect"
              ? { x: [0, -6, 6, -4, 4, 0] }
              : feedback.state === "correct"
                ? { scale: [1, 1.01, 1] }
                : undefined
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : feedback.state === "incorrect"
              ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
        }
      >
        <div className="text-xs font-semibold text-text-secondary">
          Python Playground
        </div>

        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`# Write your code here\n`}
          spellCheck={false}
          className={cn(
            "mt-3 min-h-[140px] resize-y bg-bg-secondary",
            "font-mono text-[13px] leading-relaxed text-text-primary",
            "placeholder:text-text-tertiary"
          )}
          disabled={disabled}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={onCheckAnswer} disabled={disabled}>
            Check Answer
          </Button>
          <Button variant="outline" onClick={onGetHint} disabled={disabled}>
            Get Hint
          </Button>

          {feedback.state !== "idle" && (
            <motion.div
              className={cn(
                "ml-auto text-sm font-semibold",
                feedback.state === "correct" ? "text-accent-success" : "text-accent-danger"
              )}
              role={feedback.state === "incorrect" ? "alert" : undefined}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {feedback.message}
            </motion.div>
          )}
        </div>
      </motion.div>

      {showHint && hint && (
        <div className="mt-3 rounded-xl border border-light bg-bg-secondary p-4 text-sm text-text-primary shadow-sm">
          <div className="text-xs font-semibold text-text-secondary">Hint</div>
          <div className="mt-2 leading-relaxed">{hint}</div>
        </div>
      )}
    </div>
  )
}
