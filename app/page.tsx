"use client"

import { useRouter } from "next/navigation"
import { PortalButton } from "@/components/portal/PortalButton"
import { ParticleSystem } from "@/components/portal/ParticleSystem"
import { Starfield } from "@/components/portal/Starfield"
import { AmbientShapes } from "@/components/portal/AmbientShapes"
import { PortalTransition } from "@/components/portal/PortalTransition"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function PortalLanding() {
  const router = useRouter()
  const [isActivating, setIsActivating] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Show hint after 3s of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleActivate = () => {
    setIsActivating(true)

    // Navigate after animation completes
    setTimeout(() => {
      router.push("/scenarios")
    }, 1200)
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-secondary">
      <Starfield />
      <AmbientShapes />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-primary text-center"
        >
          THE PLAYBOOK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-secondary text-center"
        >
          One template. Infinite realities.
        </motion.p>

        <div className="mt-12 relative">
          <ParticleSystem isActive={!isActivating} />
          <PortalButton onClick={handleActivate} isActivating={isActivating} />
        </div>

        {showHint && !isActivating && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-sm text-tertiary"
          >
            Click to initialize →
          </motion.p>
        )}
      </div>

      {isActivating && <PortalTransition />}
    </div>
  )
}

