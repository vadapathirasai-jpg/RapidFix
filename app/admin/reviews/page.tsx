"use client"

import useSWR from "swr"
import { Star, Flag } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-ui"
import { endpoints, fetcher, mapReviews, type ApiReview } from "@/lib/api"

export default function AdminReviewsPage() {
  const { data, isLoading } = useSWR<ApiReview[]>(endpoints.reviews("TECH001"), fetcher)
  const reviews = data ? mapReviews(data) : []

  return (
    <>
      <AdminHeader title="Reviews" subtitle="Customer reviews from the platform (live)" />

      <div className="px-5 py-6 md:px-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            No reviews available.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s < r.rating ? "fill-primary text-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-3 text-sm text-foreground">{r.text}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs font-medium text-muted-foreground">{r.name}</span>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-emergency hover:underline">
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
