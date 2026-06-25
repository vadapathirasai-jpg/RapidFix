"use client"

import { useRef, useState } from "react"
import useSWR from "swr"
import { AnimatePresence, motion } from "framer-motion"
import { DescribeEmergency } from "@/components/dispatch/describe-emergency"
import { FindingTechnicians } from "@/components/dispatch/finding-technicians"
import { TechnicianAssigned } from "@/components/dispatch/technician-assigned"
import {
  acceptEmergency,
  cancelEmergency,
  createEmergency,
  DEMO_USER_ID,
  endpoints,
  fetcher,
  mapTechnician,
  type ApiTechnician,
} from "@/lib/api"

type DispatchState = "describe" | "finding" | "assigned"

// naive keyword-based service detection for the demo
function detectService(text: string): string {
  const t = text.toLowerCase()
  if (/(power|switch|wir|electric|shock|spark|fuse|light)/.test(t)) return "Electrician"
  if (/(leak|pipe|water|tap|drain|flush|toilet|plumb)/.test(t)) return "Plumber"
  if (/(car|bike|engine|tyre|tire|brake|vehicle|mechanic)/.test(t)) return "Mechanic"
  if (/(ac|fridge|washing|appliance|cool|heat)/.test(t)) return "AC Repair"
  return "Electrician"
}

export default function DispatchPage() {
  const [state, setState] = useState<DispatchState>("describe")
  const [problem, setProblem] = useState("")
  const [service, setService] = useState("Electrician")
  const requestId = useRef<string | null>(null)

  const { data } = useSWR<ApiTechnician[]>(endpoints.technicians, fetcher)
  const technicians = Array.isArray(data) ? data.map((t) => mapTechnician(t)) : []

  const candidates = technicians.filter((t) => t.available && t.category === service)
  const fallback = technicians.filter((t) => t.available)
  const matches = (candidates.length ? candidates : fallback).slice(0, 3)
  const assigned = matches[0] ?? null

  const handleSubmit = async () => {
    const svc = detectService(problem)
    setService(svc)
    setState("finding")

    try {
      const res = await createEmergency({ userId: DEMO_USER_ID, issue: problem })
      requestId.current = res?.requestId ?? null
    } catch {
      // Surface still proceeds to matching even if the request log fails.
    }

    // Allow the matching animation to play, then accept the best match.
    setTimeout(async () => {
      const pick =
        (technicians.find((t) => t.available && t.category === svc) ??
          technicians.find((t) => t.available)) ||
        null
      if (requestId.current && pick) {
        try {
          await acceptEmergency(requestId.current, pick.id)
        } catch {
          // ignore accept failure for the demo flow
        }
      }
      setState("assigned")
    }, 3800)
  }

  const handleReset = async () => {
    if (requestId.current) {
      try {
        await cancelEmergency(requestId.current)
      } catch {
        // ignore
      }
      requestId.current = null
    }
    setState("describe")
    setProblem("")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy py-16">
      {/* Animated gradient background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,76,31,0.28), transparent 70%)" }}
        animate={{ x: ["0%", "60%", "0%"], y: ["0%", "30%", "0%"] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[55vh] w-[55vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,200,150,0.2), transparent 70%)" }}
        animate={{ x: ["0%", "-40%", "0%"], y: ["0%", "-25%", "0%"] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {state === "describe" && (
          <DescribeEmergency
            key="describe"
            value={problem}
            onChange={setProblem}
            onSubmit={handleSubmit}
          />
        )}
        {state === "finding" && (
          <FindingTechnicians
            key="finding"
            detectedService={service}
            technicians={matches}
            onCancel={handleReset}
          />
        )}
        {state === "assigned" && (
          <TechnicianAssigned
            key="assigned"
            detectedService={service}
            technician={assigned}
            onCancel={handleReset}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
