"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function EmergencyBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-emergency">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-3.5 text-center text-sm font-semibold text-white sm:text-base">
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"
        >
          <Zap className="h-3.5 w-3.5" fill="currentColor" />
        </motion.span>
        <span className="text-pretty">
          Emergency? Get a technician in under 15 minutes
        </span>
      </div>
    </div>
  )
}
