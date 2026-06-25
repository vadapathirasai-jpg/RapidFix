"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Bell,
  Siren,
  Wallet,
  CheckCircle2,
  Star,
  Activity,
  Briefcase,
  ChevronRight,
  Power,
} from "lucide-react"
import { useTechnicianApp } from "@/components/technician/app-context"
import { StatCard } from "@/components/technician/stat-card"
import { EmergencyAlert } from "@/components/technician/emergency-alert"
import { dashboardStats, sampleEmergencyAlert, inr } from "@/lib/technician-app"

const quickActions = [
  { label: "My Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Earnings", href: "/dashboard/earnings", icon: Wallet },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Verification", href: "/dashboard/verification", icon: CheckCircle2 },
]

export default function HomePage() {
  const { technician, online, setOnline } = useTechnicianApp()
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  const firstName = (technician?.name ?? "Technician").split(" ")[0]
  const rating = technician ? technician.rating.toFixed(1) : "—"

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-4 sm:px-6">
        <div>
          <p className="text-sm text-muted-foreground">Good morning,</p>
          <h1 className="text-xl font-bold text-card-foreground">{firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEmergencyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emergency px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Siren className="h-4 w-4" />
            <span className="hidden sm:inline">Test Emergency</span>
          </button>
          <button
            aria-label="Notifications"
            className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emergency" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
        {/* Availability toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between rounded-2xl border p-5 transition-colors ${
            online ? "border-accent/30 bg-accent/5" : "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                online ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
              }`}
            >
              <Power className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold text-foreground">
                {online ? "You're Online" : "You're Offline"}
              </p>
              <p className="text-sm text-muted-foreground">
                {online ? "Receiving job & emergency alerts" : "You won't receive new jobs"}
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={online}
            onClick={() => setOnline(!online)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              online ? "bg-accent" : "bg-muted-foreground/40"
            }`}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${
                online ? "right-1" : "left-1"
              }`}
            />
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Today's earnings"
            value={inr(dashboardStats.earningsToday)}
            accent="accent"
            delay={0.05}
          />
          <StatCard
            icon={CheckCircle2}
            label="Jobs completed today"
            value={String(dashboardStats.jobsToday)}
            accent="primary"
            delay={0.1}
          />
          <StatCard
            icon={Star}
            label="Average rating"
            value={rating}
            accent="navy"
            delay={0.15}
          />
          <StatCard
            icon={Activity}
            label="Response rate"
            value={`${dashboardStats.responseRate}%`}
            accent="accent"
            delay={0.2}
          />
        </div>

        {/* Active emergencies banner */}
        <Link href="/dashboard/jobs/JOB1042">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between rounded-2xl bg-emergency px-5 py-4 text-white"
          >
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20"
              >
                <Siren className="h-5 w-5" />
              </motion.span>
              <div>
                <p className="font-bold">
                  {dashboardStats.activeEmergencies} active emergency request
                </p>
                <p className="text-sm text-white/80">Andheri West · tap to view active job</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        </Link>

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 text-sm font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  href={a.href}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-muted"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{a.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <EmergencyAlert
        open={emergencyOpen}
        alert={sampleEmergencyAlert}
        onClose={() => setEmergencyOpen(false)}
      />
    </>
  )
}
