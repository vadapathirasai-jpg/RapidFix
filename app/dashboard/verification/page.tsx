"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Check,
  Clock,
  Upload,
  ShieldCheck,
  FileText,
  Home,
  Store,
  Fingerprint,
} from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { verificationItems, type VerificationItem } from "@/lib/technician-app"

const icons: Record<string, typeof Check> = {
  aadhaar: Fingerprint,
  address: Home,
  certificate: FileText,
  shop: Store,
}

const statusConfig = {
  verified: { label: "Verified", tone: "bg-accent/10 text-accent", Icon: Check },
  pending: { label: "Under review", tone: "bg-primary/10 text-primary", Icon: Clock },
  not_started: { label: "Action needed", tone: "bg-emergency/10 text-emergency", Icon: Upload },
}

export default function VerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>(verificationItems)

  const verifiedCount = items.filter((i) => i.status === "verified").length
  const progress = (verifiedCount / items.length) * 100
  const allVerified = verifiedCount === items.length

  function upload(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.status !== "verified" ? { ...i, status: "pending" } : i)),
    )
  }

  return (
    <>
      <PageHeader title="Verification Center" subtitle="Build trust with customers" />

      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
        {/* Status banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 text-white ${allVerified ? "bg-accent" : "bg-navy"}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              {allVerified ? <BadgeCheck className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            </span>
            <div>
              <p className="font-bold">
                {allVerified ? "Fully Verified Technician" : "Verification in progress"}
              </p>
              <p className="text-sm text-white/75">
                {verifiedCount} of {items.length} verifications complete
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </motion.div>

        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const Icon = icons[item.id] ?? FileText
            const cfg = statusConfig[item.status]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-card-foreground">{item.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.tone}`}
                  >
                    <cfg.Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>

                {item.status !== "verified" && (
                  <button
                    onClick={() => upload(item.id)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" />
                    {item.status === "pending" ? "Re-upload document" : "Upload document"}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}
