"use client"

import { motion } from "framer-motion"
import { Sparkles, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DescribeEmergencyProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function DescribeEmergency({ value, onChange, onSubmit }: DescribeEmergencyProps) {
  return (
    <motion.div
      key="describe"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-6 text-center"
    >
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emergency/40 bg-emergency/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emergency">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emergency opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emergency" />
        </span>
        Emergency Dispatch
      </span>

      <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl">
        {"What's your emergency?"}
      </h1>
      <p className="mt-4 text-pretty text-base leading-relaxed text-white/60">
        Tell us what went wrong. Our AI instantly identifies the right technician for the job.
      </p>

      <div className="mt-8 w-full text-left">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your problem... e.g. 'Power went out in half my house and there's a burning smell from the main switch.'"
          rows={5}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-5 text-base text-white placeholder:text-white/35 shadow-inner outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/25"
        />

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          AI will identify your service type automatically
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="mt-8 h-14 w-full gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-40 disabled:shadow-none animate-pulse-glow"
      >
        <AlertTriangle className="h-5 w-5" />
        Find Technicians Now
      </Button>

      <p className="mt-4 text-xs text-white/40">Average response time in your area: under 15 minutes</p>
    </motion.div>
  )
}
