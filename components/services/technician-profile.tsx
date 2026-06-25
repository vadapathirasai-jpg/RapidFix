"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Star,
  BadgeCheck,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { iconByName } from "@/lib/category-icons"
import { BookingModal } from "@/components/booking/booking-modal"
import {
  endpoints,
  fetcher,
  mapReviews,
  mapTechnician,
  type ApiAverage,
  type ApiReview,
  type ApiTechnician,
} from "@/lib/api"

export function TechnicianProfile({ technicianId }: { technicianId: string }) {
  const [booking, setBooking] = useState(false)

  const { data: techData, error, isLoading } = useSWR<ApiTechnician>(
    endpoints.technician(technicianId),
    fetcher,
  )
  const { data: avgData } = useSWR<ApiAverage>(endpoints.average(technicianId), fetcher)
  const { data: reviewData } = useSWR<ApiReview[]>(endpoints.reviews(technicianId), fetcher)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !techData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="text-lg font-bold text-foreground">Technician not found</p>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load this profile. It may be unavailable right now.
        </p>
        <Link
          href="/services"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to services
        </Link>
      </div>
    )
  }

  const technician = mapTechnician(techData, avgData)
  const reviewList = reviewData ? mapReviews(reviewData) : []
  const CategoryIcon = iconByName[technician.icon]

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header band */}
      <div className="bg-navy">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to services
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <img
              src={technician.photo || "/placeholder.svg"}
              alt={technician.name}
              className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{technician.name}</h1>
                <BadgeCheck className="h-5 w-5 text-accent" aria-label="Verified" />
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                {CategoryIcon && <CategoryIcon className="h-4 w-4 text-primary" />}
                {technician.category}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1 text-white">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{technician.rating}</span>
                  <span className="text-white/60">({technician.reviews})</span>
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <Briefcase className="h-4 w-4" />
                  {technician.jobs.toLocaleString("en-IN")} jobs
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <MapPin className="h-4 w-4" />
                  {technician.distance} km away
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
            <span className={`h-2 w-2 rounded-full ${technician.available ? "bg-accent" : "bg-white/40"}`} />
            {technician.available ? "Available Now" : "Currently Busy"}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Skills */}
        <section className="mt-6">
          <h2 className="text-base font-bold text-foreground">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {technician.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mt-6">
          <h2 className="text-base font-bold text-foreground">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{technician.about}</p>
        </section>

        {/* Experience + certifications */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Experience</h3>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{technician.experience}</p>
            <p className="text-xs text-muted-foreground">in the field</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Certifications</h3>
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {technician.certifications.map((c) => (
                <li key={c} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold text-foreground">Reviews</h2>
            <span className="text-sm text-muted-foreground">
              {technician.rating} · {technician.reviews} review{technician.reviews === 1 ? "" : "s"}
            </span>
          </div>
          {reviewList.length === 0 && (
            <p className="mt-3 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No reviews yet. Be the first to book and review this technician.
            </p>
          )}
          <div className="mt-3 flex flex-col gap-3">
            {reviewList.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s < review.rating ? "fill-primary text-primary" : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky book bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-xl font-bold text-foreground">₹{technician.startingPrice}</p>
          </div>
          <Button
            onClick={() => setBooking(true)}
            disabled={!technician.available}
            className="h-12 flex-1 rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:flex-none sm:px-12"
          >
            {technician.available ? "Book Now" : "Unavailable"}
          </Button>
        </div>
      </div>

      <BookingModal technician={technician} open={booking} onClose={() => setBooking(false)} />
    </div>
  )
}
