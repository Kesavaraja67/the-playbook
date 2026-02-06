"use client"

import { motion } from "framer-motion"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { PortalTransition } from "@/components/portal/PortalTransition"
import { InitializeButton } from "@/components/landing/InitializeButton"
import { setPlaybookTransitionFlag } from "@/lib/transitionOverlay"

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] })

export function CleanPortal() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    router.prefetch("/scenarios")

    return () => {
      if (navTimeoutRef.current === null) return
      clearTimeout(navTimeoutRef.current)
    }
  }, [router])

  const handleInitialize = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    setPlaybookTransitionFlag()

    navTimeoutRef.current = setTimeout(() => {
      router.push("/scenarios")
    }, 420)
  }

  return (
    <div className={`${inter.className} app-ambient relative min-h-screen w-full overflow-hidden bg-white`}>
      {isTransitioning ? <PortalTransition /> : null}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={isTransitioning ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-black text-[48px] md:text-[72px] tracking-[-2px]"
          style={{ color: "#1D1D1F" }}
        >
          THE PLAYBOOK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isTransitioning ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-[18px] md:text-[24px]"
          style={{ color: "#6E6E73" }}
        >
          One Template. Infinite Realities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={
            isTransitioning
              ? { opacity: 1, scale: 1.12 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
          whileHover={isTransitioning ? undefined : { scale: 1.02 }}
        >
          <InitializeButton onClick={handleInitialize} disabled={isTransitioning} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={isTransitioning ? { opacity: 0, y: 6 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 text-[14px]"
        style={{ color: "#98989D" }}
      >
        Powered by Tambo AI
      </motion.p>
    </div>
  )
}
