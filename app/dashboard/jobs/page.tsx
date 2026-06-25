"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Clock, ChevronRight, Siren } from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { InitialsAvatar } from "@/components/technician/initials-avatar"
import { jobs, inr, type JobStatus } from "@/lib/technician-app"

const tabs: { key: JobStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
]

const statusTone: Record<JobStatus, string> = {
  upcoming: "bg-primary/10 text-primary",
  "in-progress": "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-emergency/10 text-emergency",
}

export default function JobsPage() {
  const [tab, setTab] = useState<JobStatus>("in-progress")
  const [query, setQuery] = useState("")

  const counts = useMemo(() => {
    return tabs.reduce<Record<string, number>>((acc, t) => {
      acc[t.key] = jobs.filter((j) => j.status === t.key).length
      return acc
    }, {})
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter(
      (j) =>
        j.status === tab &&
        (q === "" ||
          j.customerName.toLowerCase().includes(q) ||
          j.area.toLowerCase().includes(q) ||
          j.issue.toLowerCase().includes(q)),
    )
  }, [tab, query])

  return (
    <>
      <PageHeader title="My Jobs" subtitle="Manage your assigned work" />

      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 sm:p-6">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, area or issue"
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  tab === t.key ? "bg-white/20" : "bg-muted"
                }`}
              >
                {counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card py-14 text-center text-sm text-muted-foreground">
            No {tab.replace("-", " ")} jobs found.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start gap-3">
                    <InitialsAvatar name={job.customerName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-card-foreground">
                          {job.customerName}
                        </p>
                        {job.emergency && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2 py-0.5 text-[10px] font-bold text-emergency">
                            <Siren className="h-3 w-3" />
                            SOS
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{job.issue}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.area} · {job.distanceKm} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.scheduledLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone[job.status]}`}
                      >
                        {job.status.replace("-", " ")}
                      </span>
                      <span className="text-sm font-bold text-card-foreground">
                        {job.amount > 0 ? inr(job.amount) : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-end text-xs font-medium text-primary">
                    View details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
