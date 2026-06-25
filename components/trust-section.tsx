"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ShieldCheck, Timer, Star, Wrench } from "lucide-react"

type Stat = {
  icon: typeof ShieldCheck
  value: number
  decimals?: number
  prefix?: string
  suffix: string
  label: string
}

const stats: Stat[] = [
  { icon: ShieldCheck, value: 500, suffix: "+", label: "Verified Technicians" },
  { icon: Timer, value: 15, suffix: " min", label: "Avg Response" },
  { icon: Star, value: 4.8, decimals: 1, suffix: "★", label: "Rating" },
  { icon: Wrench, value: 20, suffix: "+", label: "Service Types" },
]

function Counter({
  value,
  decimals = 0,
  suffix = "",
  start,
}: {
  value: number
  decimals?: number
  suffix?: string
  start: boolean
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf = 0
    const duration = 1400
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, value])

  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export function TrustSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" ref={ref}>
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
          <ShieldCheck className="h-4 w-4" />
          Verified &amp; Trusted
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Why RapidFix?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Every technician is background-checked and rated by your neighbours,
          so you always know who&apos;s coming.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold text-card-foreground sm:text-4xl">
              <Counter
                value={stat.value}
                decimals={stat.decimals}
                suffix={stat.suffix}
                start={inView}
              />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
