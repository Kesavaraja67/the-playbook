"use client"

import * as React from "react"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"

import { ComponentCanvas } from "@/components/play/ComponentCanvas"
import { AITutor } from "@/components/scenarios/educational/AITutor"
import {
  CodePlayground,
  type PlaygroundFeedback,
} from "@/components/scenarios/educational/CodePlayground"
import {
  LearningObjectives,
} from "@/components/scenarios/educational/LearningObjectives"
import {
  LessonContent,
  type LessonStep,
} from "@/components/scenarios/educational/LessonContent"
import {
  ProgressTracker,
  type TutorialStep,
} from "@/components/scenarios/educational/ProgressTracker"
import type { Scenario } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

type TutorialValidatorResult = {
  ok: boolean
  message: string
}

type TutorialStepConfig = {
  id: string
  content: LessonStep
  starterCode: string
  hint: string
  validate: (code: string) => TutorialValidatorResult
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function stripPythonComments(code: string) {
  return code.replace(/^\s*#.*/gm, "")
}

function hasStringAssignment(code: string, variableName: string) {
  const normalized = stripPythonComments(code)
  const name = escapeRegExp(variableName)
  const re = new RegExp(
    `(^|\\n)\\s*${name}\\s*=\\s*(['\"])(?:\\\\.|[^\\n])+\\2`,
    "m"
  )
  return re.test(normalized)
}

const tutorialSteps: TutorialStepConfig[] = [
  {
    id: "variables",
    content: {
      title: "Creating Variables",
      lesson: [
        "In Python, a variable is a name that points to a value.",
        "You create variables using `=`. Python will figure out the type automatically.",
      ],
      exampleCode: ['name = "Alice"', "age = 25", "is_student = True"].join("\n"),
      exerciseTitle: "Try it yourself",
      exercisePrompt:
        "Create a variable called `favorite_color` with your favorite color as a string.",
    },
    starterCode: ['# Create your variable here', 'favorite_color = ""'].join("\n"),
    hint: "Use quotes for strings. Example: `favorite_color = \"blue\"`.",
    validate: (code) => {
      if (!hasStringAssignment(code, "favorite_color")) {
        return {
          ok: false,
          message: "Not quite — make sure `favorite_color` is set to a quoted string.",
        }
      }

      return {
        ok: true,
        message: "Nice! You created a variable.",
      }
    },
  },
  {
    id: "print",
    content: {
      title: "Using Variables",
      lesson: [
        "Once you have a variable, you can use it anywhere you’d use the value itself.",
        "A common first step is printing the variable so you can see it.",
      ],
      exampleCode: ['favorite_color = "blue"', "print(favorite_color)"].join("\n"),
      exerciseTitle: "Try it yourself",
      exercisePrompt: "Print `favorite_color` using `print(...)`.",
    },
    starterCode: [
      'favorite_color = "blue"',
      "",
      "# Print your variable",
      "print(favorite_color)",
    ].join("\n"),
    hint: "You can print a variable by putting its name inside `print(...)`: `print(favorite_color)`.",
    validate: (code) => {
      const normalized = stripPythonComments(code)

      if (!hasStringAssignment(code, "favorite_color")) {
        return {
          ok: false,
          message: "Start by creating `favorite_color` as a string.",
        }
      }

      if (!/print\s*\(\s*favorite_color\s*\)/m.test(normalized)) {
        return {
          ok: false,
          message: "Almost — I’m looking for `print(favorite_color)`.",
        }
      }

      return {
        ok: true,
        message: "Great — you used your variable in a print statement.",
      }
    },
  },
  {
    id: "functions",
    content: {
      title: "Writing a Function",
      lesson: [
        "A function is a reusable block of code.",
        "In Python, you define one with `def`, then indent the body.",
      ],
      exampleCode: ['def greet(name):', '    return "Hello, " + name'].join("\n"),
      exerciseTitle: "Try it yourself",
      exercisePrompt:
        "Write a function `greet(name)` that returns a greeting like `Hello, Alice!`",
    },
    starterCode: ['# Define greet(name) here', "def greet(name):", "    "].join("\n"),
    hint: "Inside the function, return a string. Example: `return \"Hello, \" + name + \"!\"`.",
    validate: (code) => {
      const normalized = stripPythonComments(code)

      if (!/def\s+greet\s*\(\s*name\s*\)\s*:/m.test(normalized)) {
        return {
          ok: false,
          message: "Make sure you define `greet(name)` using `def greet(name):`.",
        }
      }

      if (!/^\s+return/m.test(normalized)) {
        return {
          ok: false,
          message: "Add a `return ...` line so the function gives back a greeting.",
        }
      }

      if (!/^\s+return[^\n]*\bname\b/m.test(normalized)) {
        return {
          ok: false,
          message: "Use the `name` parameter in the value you return.",
        }
      }

      return {
        ok: true,
        message: "Awesome — you wrote your first function.",
      }
    },
  },
  {
    id: "calling",
    content: {
      title: "Calling a Function",
      lesson: [
        "Defining a function doesn’t run it automatically.",
        "To run it, you call it using parentheses, like `greet(\"Alice\")`.",
      ],
      exampleCode: [
        'def greet(name):',
        '    return "Hello, " + name + "!"',
        "",
        'message = greet("Alice")',
        "print(message)",
      ].join("\n"),
      exerciseTitle: "Try it yourself",
      exercisePrompt: "Call `greet(\"Alice\")` and print the result.",
    },
    starterCode: [
      'def greet(name):',
      '    return "Hello, " + name + "!"',
      "",
      "# Call greet here",
      "",
    ].join("\n"),
    hint: "Store the result in a variable, then print it: `msg = greet(\"Alice\")` then `print(msg)`.",
    validate: (code) => {
      const normalized = stripPythonComments(code)

      if (!/def\s+greet\s*\(\s*name\s*\)\s*:/m.test(normalized)) {
        return { ok: false, message: "Keep the `greet(name)` function definition." }
      }

      if (!/greet\s*\(\s*(['"])Alice\1\s*\)/m.test(normalized)) {
        return {
          ok: false,
          message: "Call the function with the string \"Alice\": `greet(\"Alice\")`.",
        }
      }

      if (/print\s*\(\s*greet\s*\(\s*(['"])Alice\1\s*\)\s*\)/m.test(normalized)) {
        return { ok: true, message: "Perfect — you called the function and printed the result." }
      }

      const assignmentMatch = normalized.match(
        /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*greet\s*\(\s*(['"])Alice\2\s*\)\s*(?:#.*)?$/m
      )
      if (assignmentMatch) {
        const variableName = assignmentMatch[1]
        const printVariableRe = new RegExp(
          `print\\s*\\(\\s*${escapeRegExp(variableName)}\\s*\\)`
        )
        if (!printVariableRe.test(normalized)) {
          return {
            ok: false,
            message: `Almost — now print the variable (for example: \`print(${variableName})\`).`,
          }
        }

        return { ok: true, message: "Perfect — you called the function and printed the result." }
      }

      if (!/print\s*\(/m.test(normalized)) {
        return {
          ok: false,
          message: "Add a `print(...)` so you can see the greeting.",
        }
      }

      return {
        ok: false,
        message:
          "You’re printing something, but not the result of `greet(\"Alice\")`. Print that result directly, or store it in a variable and print the variable.",
      }
    },
  },
  {
    id: "return-values",
    content: {
      title: "Return Values",
      lesson: [
        "`return` sends a value back from a function.",
        "You can store that value in a variable and use it later.",
      ],
      exampleCode: [
        "def add(a, b):",
        "    return a + b",
        "",
        "total = add(2, 3)",
        "print(total)",
      ].join("\n"),
      exerciseTitle: "Try it yourself",
      exercisePrompt: "Write `add(a, b)` that returns `a + b`, then print `add(10, 5)`.",
    },
    starterCode: ["def add(a, b):", "    ", "", "# Print add(10, 5)"].join("\n"),
    hint: "Return the sum: `return a + b` and then call it: `print(add(10, 5))`.",
    validate: (code) => {
      const normalized = stripPythonComments(code)

      if (!/def\s+add\s*\(\s*a\s*,\s*b\s*\)\s*:/m.test(normalized)) {
        return { ok: false, message: "Define `add(a, b)` using `def add(a, b):`." }
      }

      if (!/^\s+return\s*\(?\s*a\s*\+\s*b\s*\)?\s*(?:#.*)?$/m.test(normalized)) {
        return { ok: false, message: "Inside `add`, return `a + b`." }
      }

      if (!/add\s*\(\s*10\s*,\s*5\s*\)/m.test(normalized)) {
        return { ok: false, message: "Call your function as `add(10, 5)`." }
      }

      if (/print\s*\(\s*add\s*\(\s*10\s*,\s*5\s*\)\s*\)/m.test(normalized)) {
        return { ok: true, message: "You’ve got it — that’s a clean return value workflow." }
      }

      const assignmentMatch = normalized.match(
        /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*add\s*\(\s*10\s*,\s*5\s*\)\s*(?:#.*)?$/m
      )
      if (assignmentMatch) {
        const variableName = assignmentMatch[1]
        const printVariableRe = new RegExp(
          `print\\s*\\(\\s*${escapeRegExp(variableName)}\\s*\\)`
        )
        if (!printVariableRe.test(normalized)) {
          return {
            ok: false,
            message: `Almost — now print the variable (for example: \`print(${variableName})\`).`,
          }
        }

        return { ok: true, message: "You’ve got it — that’s a clean return value workflow." }
      }

      if (!/print\s*\(/m.test(normalized)) {
        return { ok: false, message: "Print the result so you can see it." }
      }

      return {
        ok: false,
        message:
          "You’re printing something, but not the result of `add(10, 5)`. Print that result directly, or store it in a variable and print the variable.",
      }
    },
  },
]

export function PythonTutorialUI({ scenario }: { scenario: Scenario }) {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const learningObjectives = React.useMemo(
    () =>
      scenario.objectives ?? [
        "Understand what variables are",
        "Create variables of different types",
        "Write a simple function",
        "Call functions and use return values",
        "Complete all interactive exercises",
      ],
    [scenario.objectives]
  )

  const starterCodes = React.useMemo(
    () => tutorialSteps.map((step) => step.starterCode),
    []
  )

  const totalSteps = tutorialSteps.length

  const [stepIndex, setStepIndex] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<boolean[]>(() =>
    new Array(totalSteps).fill(false)
  )
  const [codes, setCodes] = React.useState<string[]>(() => starterCodes.slice())
  const [feedback, setFeedback] = React.useState<PlaygroundFeedback>({ state: "idle" })
  const [showHint, setShowHint] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)
  const [hintsUsed, setHintsUsed] = React.useState(0)

  const step = tutorialSteps[stepIndex]
  const conceptsMastered = completedSteps.filter(Boolean).length

  const tutorialStepsForTracker: TutorialStep[] = tutorialSteps.map((s, index) => {
    const status = completedSteps[index]
      ? "completed"
      : index === stepIndex
        ? "active"
        : "locked"

    return { id: s.id, label: `Step ${index + 1}`, status }
  })

  const reset = React.useCallback(() => {
    setStepIndex(0)
    setCompletedSteps(new Array(totalSteps).fill(false))
    setCodes(starterCodes.slice())
    setFeedback({ state: "idle" })
    setShowHint(false)
    setAttempts(0)
    setHintsUsed(0)
  }, [starterCodes, totalSteps])

  const checkAnswer = React.useCallback(() => {
    setAttempts((prev) => prev + 1)
    const code = codes[stepIndex] ?? ""
    const result = step.validate(code)
    if (!result.ok) {
      setFeedback({ state: "incorrect", message: result.message })
      return
    }

    setFeedback({ state: "correct", message: result.message })
    setCompletedSteps((prev) => {
      const next = [...prev]
      next[stepIndex] = true
      return next
    })
  }, [codes, step, stepIndex])

  const getHint = React.useCallback(() => {
    setShowHint((prev) => {
      if (!prev) setHintsUsed((h) => h + 1)
      return true
    })
  }, [])

  const canGoPrevious = stepIndex > 0
  const canGoNext = stepIndex < totalSteps - 1 && completedSteps[stepIndex]

  return (
    <div className="min-h-dvh bg-bg-secondary text-text-primary">
      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-40 h-[64px] bg-tertiary backdrop-blur border-b border-light"
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          <button
            type="button"
            onClick={() => router.push("/scenarios")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-accent-primary"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-rotate-12" />
            Back
          </button>

          <div className="text-center">
            <div className="text-sm font-semibold text-text-primary">{scenario.title}</div>
            <div className="text-xs text-text-secondary">
              Step {stepIndex + 1}/{totalSteps}
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-accent-primary"
          >
            <RotateCcw className="size-4 transition-transform duration-200 group-hover:rotate-12" />
            Reset
          </button>
        </div>
      </motion.header>

      <main className="pb-10">
        <ComponentCanvas>
          <div className="grid gap-6">
            <LearningObjectives objectives={learningObjectives} defaultOpen />

            <LessonContent
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              step={step.content}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={() => {
                setStepIndex((prev) => Math.max(0, prev - 1))
                setFeedback({ state: "idle" })
                setShowHint(false)
              }}
              onNext={() => {
                setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))
                setFeedback({ state: "idle" })
                setShowHint(false)
              }}
            >
              <CodePlayground
                code={codes[stepIndex] ?? ""}
                onCodeChange={(nextCode) => {
                  setCodes((prev) => {
                    const next = [...prev]
                    next[stepIndex] = nextCode
                    return next
                  })
                }}
                onCheckAnswer={checkAnswer}
                onGetHint={getHint}
                feedback={feedback}
                hint={step.hint}
                showHint={showHint}
              />
            </LessonContent>

            <ProgressTracker
              steps={tutorialStepsForTracker}
              conceptsMastered={conceptsMastered}
              totalConcepts={totalSteps}
            />

            <section
              className={cn("ds-card p-4")}
            >
              <div className="text-xs font-semibold text-text-secondary">Stats</div>
              <div className="mt-2 text-sm">
                Attempts: <span className="font-semibold">{attempts}</span> · Hints used:{" "}
                <span className="font-semibold">{hintsUsed}</span>
              </div>
            </section>

            <AITutor
              stepIndex={stepIndex}
              stepTitle={step.content.title}
              stepHint={step.hint}
            />
          </div>
        </ComponentCanvas>
      </main>
    </div>
  )
}
