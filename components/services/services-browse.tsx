"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Search, WifiOff } from "lucide-react"
import { categories, type Technician } from "@/lib/technicians"
import { categoryIcons } from "@/lib/category-icons"
import { endpoints, fetcher, mapTechnician, type ApiTechnician } from "@/lib/api"
import { TechnicianCard } from "./technician-card"
import { BookingModal } from "@/components/booking/booking-modal"

const filterChips = ["All", "Nearby", "Top Rated", "Emergency Available", "Under ₹500"] as const
type FilterChip = (typeof filterChips)[number]

export function ServicesBrowse() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<FilterChip>("All")
  const [category, setCategory] = useState("All")
  const [active, setActive] = useState<Technician | null>(null)

  const { data, error, isLoading } = useSWR<ApiTechnician[]>(endpoints.technicians, fetcher)

  const technicians = useMemo<Technician[]>(
    () => (Array.isArray(data) ? data.map((t) => mapTechnician(t)) : []),
    [data],
  )

  const results = useMemo(() => {
    let list = [...technicians]

    if (category !== "All") list = list.filter((t) => t.category === category)

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q)),
      )
    }

    switch (filter) {
      case "Nearby":
        list = list.filter((t) => t.distance <= 2).sort((a, b) => a.distance - b.distance)
        break
      case "Top Rated":
        list = list.filter((t) => t.topRated).sort((a, b) => b.rating - a.rating)
        break
      case "Emergency Available":
        list = list.filter((t) => t.emergency)
        break
      case "Under ₹500":
        list = list.filter((t) => t.startingPrice < 500)
        break
    }

    return list
  }, [technicians, query, filter, category])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Find a technician</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verified local pros, ready to help across your area.
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a service or describe your problem..."
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {/* Filter chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {filterChips.map((chip) => (
          <button
            key={chip}
            onClick={() => setFilter(chip)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === chip
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Category row */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat]
          const selected = category === cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-navy bg-navy text-secondary-foreground"
                  : "border-border bg-card text-foreground hover:border-navy/40"
              }`}
            >
              {Icon && <Icon className={`h-4 w-4 ${selected ? "text-primary" : "text-muted-foreground"}`} />}
              {cat}
            </button>
          )
        })}
      </div>

      {/* Results */}
      <p className="mb-3 mt-6 text-sm text-muted-foreground">
        {isLoading
          ? "Loading technicians..."
          : `${results.length} ${results.length === 1 ? "technician" : "technicians"} found`}
      </p>

      {error ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">Could not load technicians</p>
          <p className="mt-1 text-sm text-muted-foreground">Please check your connection and try again.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-56 animate-pulse flex-col rounded-2xl border border-border bg-card"
            >
              <div className="m-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
              <div className="mx-4 mt-auto mb-4 h-10 rounded-xl bg-muted" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
        >
          {results.map((t) => (
            <TechnicianCard key={t.id} technician={t} onBook={setActive} />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <p className="font-medium text-foreground">No technicians match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different category or filter.</p>
        </div>
      )}

      {active && <BookingModal technician={active} open={!!active} onClose={() => setActive(null)} />}
    </div>
  )
}
