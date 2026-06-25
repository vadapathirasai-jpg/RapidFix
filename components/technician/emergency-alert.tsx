"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Siren, MapPin, IndianRupee, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { inr, type EmergencyAlert as Alert } from "@/lib/technician-app"

const TOTAL = 30

export function EmergencyAlert({
  open,
  alert,
  onClose,
}: {
  open: boolean
  alert: Alert
  onClose: () => void
}) {
  const router = useRouter()
  const [seconds, setSeconds] = useState(TOTAL)

  useEffect(() => {
    if (!open) return
    setSeconds(TOTAL)
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          onClose()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [open, onClose])

  const progress = (seconds / TOTAL) * 100

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-navy/95 backdrop-blur-sm"
        >
          {/* Pulsing red top band */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
            className="flex items-center justify-center gap-2 bg-emergency py-4 text-white"
          >
            <Siren className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wide">
              New Emergency Request
            </span>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl"
            >
              {/* Countdown ring */}
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="absolute h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="var(--emergency)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 44}
                      animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100) }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <Clock className="mb-0.5 h-4 w-4 text-emergency" />
                    <span className="text-2xl font-bold tabular-nums text-card-foreground">
                      {seconds}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs font-semibold uppercase tracking-wide text-emergency">
                {alert.category} needed
              </p>
              <h2 className="mt-1 text-center text-xl font-bold text-card-foreground">
                {alert.customerName}
              </h2>
              <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
                {alert.issue}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted p-3 text-center">
                  <MapPin className="mx-auto mb-1 h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-card-foreground">{alert.distanceKm} km</p>
                  <p className="text-[11px] text-muted-foreground">Distance</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <IndianRupee className="mx-auto mb-1 h-4 w-4 text-accent" />
                  <p className="text-sm font-bold text-card-foreground">
                    {inr(alert.estimatedEarning)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Est. earning</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-12 flex-1 gap-2 rounded-xl border-border font-semibold"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <motion.button
                  onClick={() => {
                    onClose()
                    router.push("/dashboard/jobs/JOB1042")
                  }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-foreground"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
