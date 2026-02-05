"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { InitializeButton } from "@/components/landing/InitializeButton"

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] })

export function CleanPortal() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    router.prefetch("/scenarios")
  }, [router])

  const handleInitialize = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    try {
      window.sessionStorage.setItem("playbook:transition", "1")
    } catch {
      // Ignore storage failures (private mode, disabled cookies, etc.)
    }

    setTimeout(() => {
      router.push("/scenarios")
    }, 200)
  }

  return (
    <div
      className={`${inter.className} relative min-h-screen w-full overflow-hidden bg-white`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-black text-[48px] md:text-[72px] tracking-[-2px]"
          style={{ color: "#1D1D1F" }}
        >
          THE PLAYBOOK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-[18px] md:text-[24px]"
          style={{ color: "#6E6E73" }}
        >
          One Template. Infinite Realities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <InitializeButton onClick={handleInitialize} disabled={isTransitioning} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 text-[14px]"
        style={{ color: "#98989D" }}
      >
        Powered by Tambo AI
      </motion.p>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
