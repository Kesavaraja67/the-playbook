"use client"

import { motion } from "framer-motion"

interface PortalButtonProps {
  onClick: () => void
  isActivating: boolean
}

export function PortalButton({ onClick, isActivating }: PortalButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isActivating}
      className="ds-button-primary relative w-48 h-14 md:w-56 md:h-16 cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      whileHover={{ scale: isActivating ? 1 : 1.03 }}
      whileTap={{ scale: isActivating ? 1 : 0.98 }}
      animate={
        isActivating
          ? { scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }
          : { opacity: 1 }
      }
      transition={{ duration: 0.8, repeat: isActivating ? Infinity : 0 }}
    >
      <span className="text-base md:text-lg font-bold tracking-wide">
        {isActivating ? "Loading..." : "Initialize"}
      </span>
    </motion.button>
  )
}
