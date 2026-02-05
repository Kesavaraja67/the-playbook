"use client"

import * as React from "react"

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
  const feedbackStyles =
    feedback.state === "correct"
      ? "border-[#34C759] bg-[#34C759]/10"
      : feedback.state === "incorrect"
        ? "border-[#FF3B30] bg-[#FF3B30]/10"
        : "border-[#D2D2D7] bg-white"

  return (
    <div>
      <div
        className={cn(
          "rounded-lg border-2 p-4 shadow-[2px_2px_0px_#1D1D1F]",
          feedbackStyles
        )}
      >
        <div className="text-xs font-semibold text-[#6E6E73]">
          Python Playground
        </div>

        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`# Write your code here\n`}
          spellCheck={false}
          className={cn(
            "mt-3 min-h-[140px] resize-y border-2 border-[#D2D2D7] bg-[#F5F5F7]",
            "font-mono text-[13px] leading-relaxed text-[#1D1D1F]",
            "placeholder:text-[#6E6E73]"
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
            <div
              className={cn(
                "ml-auto text-sm font-semibold",
                feedback.state === "correct" ? "text-[#248A3D]" : "text-[#C81D11]"
              )}
              role={feedback.state === "incorrect" ? "alert" : undefined}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {showHint && hint && (
        <div className="mt-3 rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4 text-sm text-[#1D1D1F]">
          <div className="text-xs font-semibold text-[#6E6E73]">Hint</div>
          <div className="mt-2 leading-relaxed">{hint}</div>
        </div>
      )}
    </div>
  )
}
