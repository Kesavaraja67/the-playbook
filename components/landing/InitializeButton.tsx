"use client"

import { motion } from "framer-motion"
import { useState } from "react"

type InitializeButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function InitializeButton({ onClick, disabled }: InitializeButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const allowHover = !disabled && !isPressed

  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      aria-label="Initialize"
      onClick={() => {
        if (disabled) return
        setIsPressed(true)
        setTimeout(onClick, 100)
      }}
      className="relative rounded-full border-4 font-bold text-2xl text-white select-none w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
      style={{
        backgroundColor: "#0071E3",
        borderColor: "#1D1D1F",
        opacity: disabled ? 0.9 : 1,
      }}
      whileHover={
        allowHover
          ? {
              boxShadow: "4px 4px 0px #1D1D1F",
              x: 4,
              y: 4,
            }
          : undefined
      }
      animate={{
        boxShadow: isPressed ? "0px 0px 0px #1D1D1F" : "8px 8px 0px #1D1D1F",
        x: isPressed ? 8 : 0,
        y: isPressed ? 8 : 0,
        scale: disabled ? 1 : [1, 1.02, 1],
      }}
      transition={{
        boxShadow: { duration: 0.1 },
        x: { duration: 0.1 },
        y: { duration: 0.1 },
        scale: disabled
          ? { duration: 0 }
          : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
      }}
    >
      INITIALIZE
    </motion.button>
  )
}
