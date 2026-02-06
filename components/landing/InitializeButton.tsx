"use client"

import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

type InitializeButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function InitializeButton({ onClick, disabled }: InitializeButtonProps) {
  const shouldReduceMotion = useReducedMotion()
  const isButtonDisabled = Boolean(disabled)
  const [ripple, setRipple] = React.useState<
    | {
        id: number
        x: number
        y: number
      }
    | null
  >(null)

  const pulseScale = shouldReduceMotion ? 1 : [1, 1.02, 1]

  return (
    <motion.button
      type="button"
      disabled={isButtonDisabled}
      aria-label="Initialize and view scenarios"
      onClick={() => {
        if (isButtonDisabled) return
        onClick()
      }}
      onPointerDown={(event) => {
        if (isButtonDisabled) return

        const el = event.currentTarget
        const rect = el.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        setRipple({ id: Date.now(), x, y })
      }}
      className="relative isolate grid size-[168px] select-none place-items-center overflow-hidden rounded-full text-white shadow-lg md:size-[208px]"
      style={{ opacity: isButtonDisabled ? 0.8 : 1 }}
      whileHover={
        isButtonDisabled
          ? undefined
          : {
              scale: 1.05,
              y: -2,
              boxShadow: "var(--shadow-xl)",
            }
      }
      whileTap={
        isButtonDisabled
          ? undefined
          : {
              scale: 0.95,
              y: 0,
              boxShadow: "var(--shadow-md)",
            }
      }
      animate={{
        scale: isButtonDisabled ? 1 : pulseScale,
      }}
      transition={
        isButtonDisabled || shouldReduceMotion
          ? { duration: 0 }
          : {
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              default: {
                type: "spring",
                stiffness: 420,
                damping: 26,
              },
            }
      }
    >
      <span className="pointer-events-none absolute inset-0 -z-10 bg-accent-primary" />
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-80 [background:radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_55%)]" />

      {ripple ? (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-white/35"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0.6, scale: 0 }}
          animate={{ opacity: 0, scale: 18 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => setRipple(null)}
        />
      ) : null}

      <span className="text-[18px] font-semibold tracking-[0.28em] md:text-[20px]">
        INITIALIZE
      </span>
    </motion.button>
  )
}
