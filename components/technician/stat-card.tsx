"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "primary",
  delay = 0,
}: {
  icon: LucideIcon
  label: string
  value: string
  accent?: "primary" | "accent" | "emergency" | "navy"
  delay?: number
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    emergency: "bg-emergency/10 text-emergency",
    navy: "bg-navy/10 text-navy",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-2xl font-bold tabular-nums text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  )
}
