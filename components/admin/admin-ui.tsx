"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/90 px-5 py-4 backdrop-blur md:px-8">
      <div>
        <h1 className="text-pretty text-xl font-bold text-foreground md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  index = 0,
}: {
  label: string
  value: string
  delta?: string
  icon: ReactNode
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        {delta && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  Verified: "bg-accent/10 text-accent",
  Completed: "bg-accent/10 text-accent",
  Resolved: "bg-accent/10 text-accent",
  Pending: "bg-primary/10 text-primary",
  "In Progress": "bg-primary/10 text-primary",
  Searching: "bg-primary/10 text-primary",
  Dispatched: "bg-blue-500/10 text-blue-600",
  Suspended: "bg-emergency/10 text-emergency",
  Cancelled: "bg-emergency/10 text-emergency",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  )
}
