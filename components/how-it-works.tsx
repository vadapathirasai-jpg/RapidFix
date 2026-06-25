"use client"

import { motion } from "framer-motion"
import { MessageSquareText, Zap, Bike } from "lucide-react"

const steps = [
  {
    icon: MessageSquareText,
    title: "Describe your problem",
    desc: "Tell us what's wrong in a few words or tap a service category.",
  },
  {
    icon: Zap,
    title: "Get matched instantly",
    desc: "We connect you to the nearest verified technician in seconds.",
  },
  {
    icon: Bike,
    title: "Technician arrives",
    desc: "Track your pro in real time as they reach your doorstep.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Help in three simple steps
          </h2>
        </div>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3">
          {/* dotted connector */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden border-t-2 border-dashed border-white/20 md:block"
          />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                <step.icon className="h-7 w-7 text-primary-foreground" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
