"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export const componentCardClassName = "ds-card p-6"

const defaultEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: defaultEase,
    },
  },
}

type ComponentCanvasProps = {
  children: React.ReactNode
  className?: string
}

export function ComponentCanvas({ children, className }: ComponentCanvasProps) {
  const shouldReduceMotion = useReducedMotion()
  const content = React.Children.toArray(children)

  return (
    <div className={cn("bg-bg-secondary", className)}>
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        className="mx-auto max-w-[1200px] space-y-4 px-6 py-6"
      >
        {content.map((child, index) => {
          const key =
            React.isValidElement(child) && child.key != null
              ? String(child.key)
              : `canvas-item-${index}`

          return (
            <motion.div key={key} variants={itemVariants}>
              {child}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
