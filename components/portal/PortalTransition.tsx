"use client"

import { motion } from "framer-motion"

export function PortalTransition() {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 pointer-events-none"
      initial={{ scale: 0, borderRadius: "50%" }}
      animate={{ scale: 10, borderRadius: "0%" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        transformOrigin: "center center",
      }}
    />
  )
}
