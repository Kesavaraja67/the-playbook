"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { InitializeButton } from "@/components/landing/InitializeButton"
import { setPlaybookTransitionFlag } from "@/lib/transitionOverlay"

const defaultEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

const containerVariants = {
  hidden: {},
  enter: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.92 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.98 },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 18 },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 1, scale: 1.18 },
}

export function CleanPortal() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActiveRef = useRef(true)

  useEffect(() => {
    isActiveRef.current = true
    router.prefetch("/scenarios")

    return () => {
      isActiveRef.current = false
      if (navTimeoutRef.current === null) return
      clearTimeout(navTimeoutRef.current)
    }
  }, [router])

  const handleInitialize = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    setPlaybookTransitionFlag()

    const delayMs = shouldReduceMotion ? 0 : 650
    navTimeoutRef.current = setTimeout(() => {
      if (!isActiveRef.current) return
      router.push("/scenarios")
    }, delayMs)
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-bg-primary">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(74,144,226,0.12), transparent 50%), radial-gradient(circle at 75% 30%, rgba(16,185,129,0.08), transparent 55%), radial-gradient(circle at 50% 85%, rgba(0,0,0,0.06), transparent 60%)",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.55, 0.75, 0.55],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isTransitioning ? "exit" : "enter"}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.h1
          variants={titleVariants}
          transition={{ duration: 0.6, ease: defaultEase }}
          className="text-text-primary font-semibold text-[44px] tracking-[-0.04em] md:text-[72px]"
        >
          THE PLAYBOOK
        </motion.h1>

        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.45, ease: defaultEase }}
          className="mt-5 max-w-[680px] text-[18px] leading-relaxed text-text-secondary md:text-[24px]"
        >
          One Template. Infinite Realities.
        </motion.p>

        <motion.div
          variants={buttonVariants}
          transition={{ duration: 0.55, ease: defaultEase }}
          className="mt-14"
        >
          <InitializeButton onClick={handleInitialize} disabled={isTransitioning} />
        </motion.div>

        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.35, ease: defaultEase }}
          className="mt-14 text-[13px] font-medium tracking-wide text-text-tertiary"
        >
          Powered by Tambo AI
        </motion.p>
      </motion.div>
    </div>
  )
}
