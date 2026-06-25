"use client"

import { motion } from "framer-motion"
import { Users, Wrench, ClipboardList, IndianRupee, Siren, ShieldCheck } from "lucide-react"
import { AdminHeader, StatCard, StatusBadge } from "@/components/admin/admin-ui"
import { ADMIN_BOOKINGS, EMERGENCY_REQUESTS } from "@/lib/admin-data"

const STATS = [
  { label: "Total Customers", value: "12,480", delta: "+8.2%", icon: <Users className="h-5 w-5" /> },
  { label: "Active Technicians", value: "3,156", delta: "+4.1%", icon: <Wrench className="h-5 w-5" /> },
  { label: "Bookings Today", value: "1,894", delta: "+12%", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Revenue (Month)", value: "₹48.2L", delta: "+9.6%", icon: <IndianRupee className="h-5 w-5" /> },
]

const WEEKLY = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 54 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 96 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 71 },
]

export default function AdminDashboardPage() {
  const max = Math.max(...WEEKLY.map((w) => w.value))

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Platform overview and live activity" />

      <div className="space-y-6 px-5 py-6 md:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Weekly bookings chart */}
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Bookings This Week</h2>
              <span className="text-sm text-muted-foreground">9,842 total</span>
            </div>
            <div className="mt-6 flex h-48 items-end justify-between gap-3">
              {WEEKLY.map((w, i) => (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(w.value / max) * 100}%` }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-t-lg bg-primary"
                    style={{ minHeight: 4 }}
                  />
                  <span className="text-xs text-muted-foreground">{w.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live emergency feed */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emergency/10 text-emergency">
                <Siren className="h-4 w-4" />
              </span>
              <h2 className="font-bold text-foreground">Live Emergencies</h2>
            </div>
            <div className="mt-4 space-y-3">
              {EMERGENCY_REQUESTS.map((e) => (
                <div key={e.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{e.customer}</span>
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{e.issue}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {e.location} · {e.raisedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="pb-2 font-medium">Booking ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Technician</th>
                  <th className="pb-2 font-medium">Service</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ADMIN_BOOKINGS.map((b) => (
                  <tr key={b.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 font-medium text-foreground">{b.id}</td>
                    <td className="py-3 text-muted-foreground">{b.customer}</td>
                    <td className="py-3 text-muted-foreground">{b.technician}</td>
                    <td className="py-3 text-muted-foreground">{b.service}</td>
                    <td className="py-3 font-medium text-foreground">₹{b.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
