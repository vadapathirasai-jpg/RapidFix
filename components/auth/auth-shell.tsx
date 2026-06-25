"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, ShieldCheck, Clock, MapPin } from "lucide-react"
import type { ReactNode } from "react"

const highlights = [
  { icon: Clock, title: "15-minute dispatch", text: "Verified help reaches you fast, day or night." },
  { icon: ShieldCheck, title: "Background-checked pros", text: "Every technician is ID and skill verified." },
  { icon: MapPin, title: "Across India", text: "From metros to small towns, we have you covered." },
]

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  accent = "primary",
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  accent?: "primary" | "secondary"
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Branding panel */}
      <aside className="relative hidden overflow-hidden bg-secondary px-12 py-14 text-secondary-foreground lg:flex lg:w-[44%] lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </span>
          <span className="text-2xl font-bold tracking-tight">RapidFix</span>
        </Link>

        <div className="relative">
          <h2 className="text-balance text-3xl font-bold leading-tight">
            Emergency technicians, on demand across India.
          </h2>
          <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-secondary-foreground/70">
            Trusted by thousands of households for fast, reliable, and fair-priced repairs.
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {highlights.map((h, i) => (
              <motion.li
                key={h.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <h.icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-xs leading-relaxed text-secondary-foreground/60">{h.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-secondary-foreground/50">
          &copy; {new Date().getFullYear()} RapidFix Technologies Pvt. Ltd.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">RapidFix</span>
          </Link>

          <span
            className={
              accent === "secondary"
                ? "inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary"
                : "inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            }
          >
            {subtitle}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </main>
    </div>
  )
}
