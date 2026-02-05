"use client"

import { useRouter } from "next/navigation"
import { PortalButton } from "@/components/portal/PortalButton"
import { ParticleSystem } from "@/components/portal/ParticleSystem"
import { Starfield } from "@/components/portal/Starfield"
import { AmbientShapes } from "@/components/portal/AmbientShapes"
import { CursorTrail } from "@/components/portal/CursorTrail"
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-radial from-[#1a1a2e] via-[#0f0f1e] to-[#000000]">
      {/* Background Layers */}
      <Starfield />
      <AmbientShapes />
      
      {/* Interactive Effects */}
      <CursorTrail />
      
      {/* Central Portal Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-24 gradient-text"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          THE PLAYBOOK
        </motion.h1>

        {/* Portal Button with Particles */}
        <div className="relative">
          <ParticleSystem isActive={!isActivating} />
          <PortalButton onClick={handleActivate} isActivating={isActivating} />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-slate-300 mt-20"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          One Template. Infinite Realities.
        </motion.p>

        {/* Hint */}
        {showHint && !isActivating && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute bottom-20 text-sm text-slate-400 animate-pulse"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Click to initialize →
          </motion.p>
        )}
      </div>

      {/* Transition Overlay */}
      {isActivating && <PortalTransition />}
    </div>
  )
}

