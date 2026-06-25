"use client"

import { motion } from "framer-motion"

const services = [
  { name: "Electrician", emoji: "⚡" },
  { name: "Plumber", emoji: "🔧" },
  { name: "Mechanic", emoji: "🔩" },
  { name: "Appliance Repair", emoji: "🧰" },
  { name: "Carpenter", emoji: "🪚" },
  { name: "Mobile Repair", emoji: "📱" },
  { name: "AC Repair", emoji: "❄️" },
  { name: "Agricultural Equipment", emoji: "🚜" },
  { name: "Computer Repair", emoji: "💻" },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ServiceCategories() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Our Services
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Help for every problem, big or small
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Pick a category and we&apos;ll match you with a verified local
          professional, available right now.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <motion.button
            key={service.name}
            variants={card}
            whileHover={{ y: -6 }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-xl"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
              {service.emoji}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-card-foreground">
                {service.name}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Available Now
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}
