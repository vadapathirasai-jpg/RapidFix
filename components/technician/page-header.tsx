"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { ReactNode } from "react"

export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
}: {
  title: string
  subtitle?: string
  backHref?: string
  action?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Go back"
            className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}
        <div>
          <h1 className="text-lg font-bold text-card-foreground sm:text-xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  )
}
