"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, FileText, MapPin, Phone, Briefcase, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminHeader, StatusBadge } from "@/components/admin/admin-ui"
import { VERIFICATION_REQUESTS, type VerificationRequest } from "@/lib/admin-data"

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState(VERIFICATION_REQUESTS)
  const [active, setActive] = useState<VerificationRequest | null>(null)
  const [toast, setToast] = useState("")

  function resolve(id: string, action: "approved" | "rejected", name: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setActive(null)
    setToast(`${name} ${action}`)
    setTimeout(() => setToast(""), 2600)
  }

  return (
    <>
      <AdminHeader
        title="Verification Requests"
        subtitle={`${requests.length} technician${requests.length === 1 ? "" : "s"} awaiting review`}
      />

      <div className="px-5 py-6 md:px-8">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <Check className="h-10 w-10 text-accent" />
            <p className="mt-3 font-semibold text-foreground">All caught up</p>
            <p className="mt-1 text-sm text-muted-foreground">No pending verification requests.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((r) => (
              <motion.div
                key={r.id}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-sm text-primary">{r.skill}</p>
                  </div>
                  <StatusBadge status="Pending" />
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {r.experience} experience
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {r.city}, {r.state}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {r.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> {r.documents.length} documents · {r.submittedAt}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setActive(r)}
                  className="mt-4 w-full gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Review Documents
                </Button>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => resolve(r.id, "approved", r.name)}
                    className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    onClick={() => resolve(r.id, "rejected", r.name)}
                    className="gap-1 bg-emergency text-white hover:bg-emergency/90"
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Document review modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-2xl bg-card p-5 sm:rounded-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{active.name}</h2>
                  <p className="text-sm text-primary">
                    {active.skill} · {active.experience}
                  </p>
                </div>
                <button onClick={() => setActive(null)} aria-label="Close">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {active.documents.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      {d.label}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {d.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  onClick={() => resolve(active.id, "rejected", active.name)}
                  variant="outline"
                  className="gap-1 border-emergency text-emergency hover:bg-emergency/10"
                >
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button
                  onClick={() => resolve(active.id, "approved", active.name)}
                  className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Check className="h-4 w-4" /> Approve
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-white shadow-lg md:bottom-6"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
