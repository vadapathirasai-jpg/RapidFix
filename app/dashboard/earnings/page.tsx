"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, TrendingUp, CheckCircle2, ArrowDownToLine, Clock } from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { Button } from "@/components/ui/button"
import { earnings, inr } from "@/lib/technician-app"

type Range = "today" | "week" | "month"

const ranges: { key: Range; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
]

export default function EarningsPage() {
  const [range, setRange] = useState<Range>("week")

  const amount = earnings[range]
  const jobs =
    range === "today" ? earnings.jobsToday : range === "week" ? earnings.jobsWeek : earnings.jobsMonth
  const maxBar = Math.max(...earnings.weekly.map((w) => w.amount))

  return (
    <>
      <PageHeader title="Earnings" subtitle="Track your income and withdrawals" />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
        {/* Range tabs */}
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                range === r.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Hero earnings card */}
        <motion.div
          key={range}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-navy p-6 text-white"
        >
          <div className="flex items-center gap-2 text-white/70">
            <Wallet className="h-4 w-4" />
            <span className="text-sm">Total earnings</span>
          </div>
          <p className="mt-2 text-4xl font-bold tabular-nums">{inr(amount)}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {jobs} jobs completed
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-accent" />
              +12% vs last
            </span>
          </div>
        </motion.div>

        {/* Weekly chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-card-foreground">This week</h2>
          <div className="mt-5 flex h-44 items-end justify-between gap-2">
            {earnings.weekly.map((w, i) => (
              <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(w.amount / maxBar) * 100}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-9 rounded-t-lg bg-primary"
                  style={{ minHeight: 4 }}
                  title={inr(w.amount)}
                />
                <span className="text-[11px] text-muted-foreground">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawals */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Withdrawal history</h2>
            <Button size="sm" className="h-9 gap-1.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <ArrowDownToLine className="h-4 w-4" />
              Withdraw
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {earnings.withdrawals.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      w.status === "Completed"
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {w.status === "Completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{inr(w.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.date} · {w.method}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    w.status === "Completed"
                      ? "bg-accent/10 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {w.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
