"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { Star, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { InitialsAvatar } from "@/components/technician/initials-avatar"
import {
  endpoints,
  fetcher,
  mapReviews,
  type ApiAverage,
  type ApiReview,
} from "@/lib/api"
import { CURRENT_TECHNICIAN_ID } from "@/lib/technician-app"

export default function ReviewsPage() {
  const { data: reviewData, isLoading } = useSWR<ApiReview[]>(
    endpoints.reviews(CURRENT_TECHNICIAN_ID),
    fetcher,
  )
  const { data: avgData } = useSWR<ApiAverage>(
    endpoints.average(CURRENT_TECHNICIAN_ID),
    fetcher,
  )

  const reviews = reviewData ? mapReviews(reviewData) : []
  const total = reviews.length
  const average =
    avgData?.averageRating ??
    (total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0)

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length
    return { star, count, pct: total ? (count / total) * 100 : 0 }
  })

  return (
    <>
      <PageHeader title="Reviews & Ratings" subtitle="What customers say about you" />

      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
        {/* Summary */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center justify-center sm:w-40">
            <p className="text-5xl font-bold text-card-foreground">{average.toFixed(1)}</p>
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= Math.round(average)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{total} reviews</p>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2">
                <span className="flex w-8 items-center gap-0.5 text-xs text-muted-foreground">
                  {b.star}
                  <Star className="h-3 w-3 fill-primary text-primary" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <span className="w-6 text-right text-xs text-muted-foreground">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent feedback */}
        <div>
          <h2 className="mb-3 text-sm font-bold text-foreground">Recent feedback</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card py-12 text-center text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={r.name} size={40} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-card-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="text-xs font-bold text-primary">{r.rating}</span>
                    </div>
                  </div>
                  {r.text && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
