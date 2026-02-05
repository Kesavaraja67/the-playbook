"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface PortalButtonProps {
  onClick: () => void
  isActivating: boolean
}

export function PortalButton({ onClick, isActivating }: PortalButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      disabled={isActivating}
      className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer disabled:cursor-not-allowed z-10"
      style={{
        background: "rgba(0, 217, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "2px solid rgba(0, 217, 255, 0.3)",
        boxShadow: `
          0 0 40px rgba(0, 217, 255, ${isHovered ? 0.6 : 0.3}),
          0 0 80px rgba(0, 217, 255, ${isHovered ? 0.3 : 0.15}),
          inset 0 0 20px rgba(255, 255, 255, 0.1)
        `,
      }}
      animate={{
        scale: isActivating 
          ? [1, 1.2, 0.95, 20] 
          : isHovered 
          ? [1, 1.05, 1] 
          : [1, 1.02, 1],
      }}
      transition={{
        duration: isActivating ? 1.2 : 2,
        repeat: isActivating ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Rotating Border Gradient */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-70"
        style={{
          background: "conic-gradient(from 0deg, #00d9ff, #a855f7, #ec4899, #00d9ff)",
          maskImage: "radial-gradient(circle, transparent 95%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 95%, black 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Content */}
      <div className="absolute inset-1 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
        <motion.span
          className="text-xl md:text-2xl font-bold text-white tracking-wider"
          animate={{
            opacity: isHovered ? 1 : 0.9,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {isActivating ? "LOADING..." : "INITIALIZE"}
        </motion.span>
      </div>

      {/* Expanding Rings on Pulse */}
      {!isActivating && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/50"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}
    </motion.button>
  )
}
