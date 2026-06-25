"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Check, Star, Phone, X, MapPin, BadgeCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Technician } from "@/lib/technicians"

interface TechnicianAssignedProps {
  detectedService: string
  technician: Technician | null
  onCancel: () => void
}

export function TechnicianAssigned({ detectedService, technician, onCancel }: TechnicianAssignedProps) {
  const [seconds, setSeconds] = useState(12 * 60)

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.35 },
      colors: ["#FF4C1F", "#00C896", "#ffffff"],
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <motion.div
      key="assigned"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/40"
      >
        <Check className="h-10 w-10 text-accent-foreground" strokeWidth={3} />
      </motion.div>

      <h2 className="mt-5 text-2xl font-bold text-white">Technician Assigned!</h2>
      <p className="mt-1 text-sm text-white/60">Your {detectedService.toLowerCase()} is on the way.</p>

      {/* Technician card */}
      <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4">
          <Image
            src={technician?.photo || "/technician-avatar.png"}
            alt={technician?.name ?? "Assigned technician"}
            width={60}
            height={60}
            className="h-15 w-15 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{technician?.name ?? "Technician"}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {technician?.rating ?? "4.8"} · {(technician?.jobs ?? 0).toLocaleString("en-IN")} jobs
              {technician?.phone ? ` · ${technician.phone}` : ""}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-primary">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-semibold">
            Arriving in ~{mins}:{secs.toString().padStart(2, "0")} min
          </span>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="relative mt-4 flex h-36 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40"
        >
          <MapPin className="h-5 w-5 text-primary-foreground" />
        </motion.div>
        <span className="relative text-xs font-medium text-white/50">Live tracking coming soon</span>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <a href={technician?.phone ? `tel:${technician.phone}` : "#"} className="contents">
          <Button className="h-12 gap-2 rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
            <Phone className="h-4 w-4" />
            Call Technician
          </Button>
        </a>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="h-12 gap-2 rounded-xl border border-white/10 font-semibold text-white/70 hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
          Cancel Request
        </Button>
      </div>
    </motion.div>
  )
}
