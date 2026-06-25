"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Loader2, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Technician } from "@/lib/technicians"

interface FindingTechniciansProps {
  detectedService: string
  technicians: Technician[]
  onCancel: () => void
}

export function FindingTechnicians({ detectedService, technicians, onCancel }: FindingTechniciansProps) {
  const techs = technicians
  return (
    <motion.div
      key="finding"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6"
    >
      {/* Radar */}
      <div className="relative mb-6 flex h-44 w-44 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-primary/40"
            style={{ height: "100%", width: "100%" }}
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
        <div className="absolute h-24 w-24 rounded-full bg-primary/15" />
        <motion.div
          className="absolute h-44 w-44 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,76,31,0.35) 60deg, transparent 90deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
          <MapPin className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white">Finding nearby technicians...</h2>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent">
        <Sparkle />
        AI detected: {detectedService}
      </div>

      <div className="mt-8 w-full space-y-3">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.55, duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5"
          >
            <Image
              src={tech.photo || "/placeholder.svg"}
              alt={tech.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white">{tech.name}</p>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tech.distance} km away
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {tech.rating}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Contacting...
            </div>
          </motion.div>
        ))}
        {techs.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
            Searching for available technicians near you...
          </p>
        )}
      </div>

      <Button
        onClick={onCancel}
        variant="ghost"
        className="mt-8 text-white/50 hover:bg-white/5 hover:text-white"
      >
        Cancel request
      </Button>
    </motion.div>
  )
}

function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  )
}
