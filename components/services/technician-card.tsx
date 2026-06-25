"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, MapPin, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { iconByName } from "@/lib/category-icons"
import type { Technician } from "@/lib/technicians"

export function TechnicianCard({
  technician,
  onBook,
}: {
  technician: Technician
  onBook: (t: Technician) => void
}) {
  const CategoryIcon = iconByName[technician.icon]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/technician/${technician.id}`} className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={technician.photo || "/placeholder.svg"}
              alt={technician.name}
              className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
            />
            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                technician.available ? "bg-accent" : "bg-muted-foreground"
              }`}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate font-bold text-foreground">{technician.name}</h3>
              <BadgeCheck className="h-4 w-4 shrink-0 text-accent" aria-label="Verified" />
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5 text-primary" />}
              <span className="truncate">{technician.category}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-semibold text-foreground">{technician.rating}</span>
              <span className="text-muted-foreground">({technician.reviews})</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {technician.distance} km away
          </span>
          <span
            className={`flex items-center gap-1 font-medium ${
              technician.available ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                technician.available ? "bg-accent" : "bg-muted-foreground"
              }`}
            />
            {technician.available ? "Available Now" : "Busy"}
          </span>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-lg font-bold text-foreground">₹{technician.startingPrice}</p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={() => onBook(technician)}
          disabled={!technician.available}
          className="h-10 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {technician.available ? "Book Now" : "Unavailable"}
        </Button>
      </div>
    </motion.div>
  )
}
