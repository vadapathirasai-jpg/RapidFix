"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Check,
  ChevronLeft,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBooking, DEMO_USER_ID } from "@/lib/api"
import type { Technician } from "@/lib/technicians"

const serviceTypes = ["General Visit", "Repair", "Installation", "Maintenance", "Emergency"]

const timeSlots = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
]

function getNextDays(count: number) {
  const days = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      key: d.toISOString().slice(0, 10),
    })
  }
  return days
}

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export function BookingModal({
  technician,
  open,
  onClose,
}: {
  technician: Technician
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [serviceType, setServiceType] = useState("Repair")
  const [problem, setProblem] = useState("")
  const [day, setDay] = useState("")
  const [slot, setSlot] = useState("")
  const [address, setAddress] = useState("")

  const days = getNextDays(5)

  useEffect(() => {
    if (open) {
      setStep(1)
      setDone(false)
      setDir(1)
      setSubmitting(false)
      setSubmitError("")
    }
  }, [open])

  const visitFee = 99
  const total = technician.startingPrice + visitFee

  function next() {
    setDir(1)
    setStep((s) => Math.min(s + 1, 3))
  }
  function back() {
    setDir(-1)
    setStep((s) => Math.max(s - 1, 1))
  }
  async function confirm() {
    setSubmitting(true)
    setSubmitError("")
    try {
      await createBooking({
        userId: DEMO_USER_ID,
        technicianId: technician.id,
        serviceType,
        issue: problem,
      })
      setDone(true)
    } catch {
      setSubmitError("Could not place booking. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const canContinue = step === 1 ? problem.trim().length > 0 : step === 2 ? day && slot && address.trim().length > 0 : true

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card sm:rounded-3xl"
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!done ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div className="flex items-center gap-2">
                    {step > 1 && (
                      <button
                        onClick={back}
                        className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                        aria-label="Go back"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Step {step} of 3</p>
                      <h2 className="text-base font-bold text-foreground">
                        {step === 1 ? "Service Details" : step === 2 ? "Date & Address" : "Confirm Booking"}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex gap-1.5 px-5 pt-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        s <= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {step === 1 && (
                        <div className="flex flex-col gap-5">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                              Select service type
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {serviceTypes.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setServiceType(t)}
                                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                    serviceType === t
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                              Describe your problem
                            </label>
                            <textarea
                              value={problem}
                              onChange={(e) => setProblem(e.target.value)}
                              rows={4}
                              placeholder="e.g. The ceiling fan in the living room stopped working and makes a buzzing sound..."
                              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="flex flex-col gap-5">
                          <div>
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                              <Calendar className="h-4 w-4 text-primary" /> Choose a day
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {days.map((d) => (
                                <button
                                  key={d.key}
                                  onClick={() => setDay(d.key)}
                                  className={`flex min-w-[68px] flex-col items-center rounded-xl border px-3 py-2 transition-colors ${
                                    day === d.key
                                      ? "border-primary bg-primary/10"
                                      : "border-border bg-background hover:border-primary/50"
                                  }`}
                                >
                                  <span
                                    className={`text-xs font-semibold ${
                                      day === d.key ? "text-primary" : "text-foreground"
                                    }`}
                                  >
                                    {d.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{d.date}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                              Available time slots
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setSlot(t)}
                                  className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                                    slot === t
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-foreground hover:border-primary/50"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                              <MapPin className="h-4 w-4 text-primary" /> Service address
                            </label>
                            <input
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="House no, village/town, district"
                              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
                            <img
                              src={technician.photo || "/placeholder.svg"}
                              alt={technician.name}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-foreground">{technician.name}</p>
                              <p className="text-sm text-muted-foreground">{technician.category}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border bg-background p-4">
                            <h3 className="mb-3 text-sm font-bold text-foreground">Booking summary</h3>
                            <dl className="flex flex-col gap-2 text-sm">
                              <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Service</dt>
                                <dd className="font-medium text-foreground">{serviceType}</dd>
                              </div>
                              <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">When</dt>
                                <dd className="font-medium text-foreground">
                                  {days.find((d) => d.key === day)?.label}, {slot}
                                </dd>
                              </div>
                              <div className="flex items-start justify-between gap-4">
                                <dt className="text-muted-foreground">Address</dt>
                                <dd className="max-w-[60%] text-right font-medium text-foreground">{address}</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="rounded-2xl border border-border bg-background p-4">
                            <dl className="flex flex-col gap-2 text-sm">
                              <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Starting price</dt>
                                <dd className="font-medium text-foreground">₹{technician.startingPrice}</dd>
                              </div>
                              <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Visit fee</dt>
                                <dd className="font-medium text-foreground">₹{visitFee}</dd>
                              </div>
                              <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                                <dt className="font-bold text-foreground">Estimated total</dt>
                                <dd className="text-lg font-bold text-primary">₹{total}</dd>
                              </div>
                            </dl>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Final price confirmed by technician after inspection.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-4">
                  {submitError && (
                    <p className="mb-2 text-center text-sm font-medium text-emergency">{submitError}</p>
                  )}
                  <Button
                    onClick={step === 3 ? confirm : next}
                    disabled={!canContinue || submitting}
                    className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {step === 3 ? (submitting ? "Placing booking..." : "Confirm Booking") : "Continue"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/15"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 16 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent"
                  >
                    <Check className="h-9 w-9 text-accent-foreground" strokeWidth={3} />
                  </motion.div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 text-2xl font-bold text-foreground"
                >
                  Booking Requested!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-2 max-w-xs text-sm text-muted-foreground"
                >
                  {`${technician.name} will confirm shortly. You'll get a notification once accepted.`}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Technician will confirm shortly
                </motion.div>
                <Button
                  onClick={onClose}
                  className="mt-6 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
