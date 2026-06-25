"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Check, FileCheck2, ShieldCheck, LayoutDashboard, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const timeline = [
  { label: "Documents Submitted", icon: FileCheck2, state: "done" as const, note: "Just now" },
  { label: "Under Review", icon: ShieldCheck, state: "active" as const, note: "In progress" },
  { label: "Verified", icon: Check, state: "todo" as const, note: "Pending" },
  { label: "Dashboard Access", icon: LayoutDashboard, state: "todo" as const, note: "Locked" },
]

export default function VerificationPendingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">RapidFix</span>
          </Link>
          <Link href="/login/technician" className="text-sm font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-5 py-12 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary/10"
        >
          <motion.span
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-primary/10"
          />
          <Clock className="h-14 w-14 text-primary" />
        </motion.div>

        <span className="mt-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Documents Submitted Successfully
        </span>
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Verification Pending</h1>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Our verification team is reviewing your documents. This usually takes less than 24 hours. We&apos;ll notify you by
          SMS and email as soon as your account is approved.
        </p>

        {/* Timeline */}
        <div className="mt-10 w-full max-w-sm text-left">
          {timeline.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    item.state === "done"
                      ? "bg-accent text-accent-foreground"
                      : item.state === "active"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                {i < timeline.length - 1 && (
                  <span className={`my-1 w-0.5 flex-1 rounded-full ${item.state === "done" ? "bg-accent" : "bg-border"}`} style={{ minHeight: 28 }} />
                )}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-semibold ${item.state === "todo" ? "text-muted-foreground" : "text-foreground"}`}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-2 flex w-full max-w-sm flex-col gap-3">
          <Link href="/login/technician">
            <Button className="w-full h-12 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
              Check application status
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              Back to home
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Dashboard access is locked until an admin verifies your documents.
        </p>
      </main>
    </div>
  )
}
