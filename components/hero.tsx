"use client"
 
import { motion } from "framer-motion"
import { Star, MapPin, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
 
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}
 
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
 
export function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-navy pt-16 text-white">
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[640px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,76,31,0.55) 0%, rgba(255,76,31,0.12) 45%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            Trusted across rural India
          </motion.span>
 
          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Fast. Trusted.{" "}
            <span className="text-primary">Local.</span>
          </motion.h1>
 
          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/70"
          >
            Book verified technicians in minutes or get emergency help
            instantly.
          </motion.p>
 
          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/services">
              <Button
                size="lg"
                className="h-12 w-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                Book a Service
              </Button>
            </Link>
            <Link href="/dispatch">
              <Button
                size="lg"
                className="h-12 w-full animate-pulse-glow bg-emergency px-7 text-base font-semibold text-white hover:bg-emergency/90 sm:w-auto"
              >
                Emergency Help 🚨
              </Button>
            </Link>
          </motion.div>
 
          <motion.div
            variants={item}
            className="mt-8 flex items-center gap-6 text-sm text-white/60"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Verified pros
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" fill="currentColor" />
              4.8 average rating
            </span>
          </motion.div>
        </motion.div>
 
        {/* floating cards */}
        <div className="relative h-[360px] w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-2 top-6 w-72"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-white p-4 text-navy shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/technician-avatar.png"
                  alt="Technician Ravi Kumar"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Ravi Kumar</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-primary" fill="currentColor" />
                    4.9 · Electrician
                  </p>
                </div>
                <span className="rounded-full bg-accent/15 px-2 py-1 text-[10px] font-semibold text-accent">
                  Verified
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Arriving in 4 min
              </div>
            </motion.div>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-4 right-2 w-64"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-white p-4 text-navy shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/technician-avatar-2.png"
                  alt="Technician Anita Devi"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Anita Devi</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-primary" fill="currentColor" />
                    4.8 · Plumber
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Available now
                </span>
                <span className="font-semibold text-primary">2.1 km away</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
