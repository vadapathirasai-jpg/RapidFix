"use client"

import { useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Check,
  Camera,
  X,
  Siren,
  IndianRupee,
} from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { InitialsAvatar } from "@/components/technician/initials-avatar"
import { Button } from "@/components/ui/button"
import { jobs, WORKFLOW_STAGES, inr, type WorkflowStage } from "@/lib/technician-app"

export default function ActiveJobPage() {
  const params = useParams<{ id: string }>()
  const job = useMemo(() => jobs.find((j) => j.id === params.id), [params.id])

  const initialIndex = job ? WORKFLOW_STAGES.findIndex((s) => s.key === job.stage) : 0
  const [stageIndex, setStageIndex] = useState(Math.max(0, initialIndex))
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos, setAfterPhotos] = useState<string[]>([])

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  if (!job) {
    return (
      <>
        <PageHeader title="Job not found" backHref="/dashboard/jobs" />
        <p className="p-6 text-sm text-muted-foreground">
          This job could not be found. Return to My Jobs.
        </p>
      </>
    )
  }

  const currentStage = WORKFLOW_STAGES[stageIndex]
  const isComplete = currentStage.key === "completed"
  const nextStage = WORKFLOW_STAGES[stageIndex + 1]

  function addPhotos(files: FileList | null, kind: "before" | "after") {
    if (!files) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    if (kind === "before") setBeforePhotos((p) => [...p, ...urls])
    else setAfterPhotos((p) => [...p, ...urls])
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${job.address}, ${job.city}`,
  )}`
  const telUrl = `tel:${job.phone.replace(/\s/g, "")}`
  const waUrl = `https://wa.me/${job.phone.replace(/[^0-9]/g, "")}`

  return (
    <>
      <PageHeader title={`Job ${job.id}`} subtitle={job.category} backHref="/dashboard/jobs" />

      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
        {/* Customer card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <InitialsAvatar name={job.customerName} size={52} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-card-foreground">{job.customerName}</p>
                {job.emergency && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emergency/10 px-2 py-0.5 text-[10px] font-bold text-emergency">
                    <Siren className="h-3 w-3" />
                    EMERGENCY
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {job.address}, {job.city}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <span className="text-sm text-muted-foreground">Job value</span>
            <span className="flex items-center gap-0.5 text-lg font-bold text-card-foreground">
              <IndianRupee className="h-4 w-4" />
              {job.amount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Contact actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <a
              href={telUrl}
              className="flex flex-col items-center gap-1 rounded-xl border border-border py-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="h-5 w-5 text-primary" />
              Call
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl border border-border py-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5 text-accent" />
              WhatsApp
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl border border-border py-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Navigation className="h-5 w-5 text-navy" />
              Navigate
            </a>
          </div>
        </div>

        {/* Job description */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-card-foreground">Job description</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.issue}</p>
        </div>

        {/* Status workflow */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-card-foreground">Status</h2>
          <ol className="mt-4 flex flex-col gap-0">
            {WORKFLOW_STAGES.map((stage, i) => {
              const done = i < stageIndex
              const active = i === stageIndex
              return (
                <li key={stage.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        done
                          ? "bg-accent text-accent-foreground"
                          : active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    {i < WORKFLOW_STAGES.length - 1 && (
                      <span
                        className={`my-1 w-0.5 flex-1 ${done ? "bg-accent" : "bg-border"}`}
                        style={{ minHeight: 18 }}
                      />
                    )}
                  </div>
                  <div className={`pb-4 ${active ? "" : ""}`}>
                    <p
                      className={`text-sm font-medium ${
                        active
                          ? "text-primary"
                          : done
                            ? "text-card-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stage.label}
                    </p>
                    {active && <p className="text-xs text-muted-foreground">Current stage</p>}
                  </div>
                </li>
              )
            })}
          </ol>

          {!isComplete && (
            <Button
              onClick={() => setStageIndex((i) => Math.min(i + 1, WORKFLOW_STAGES.length - 1))}
              className="mt-2 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Mark as {nextStage.label}
            </Button>
          )}
          {isComplete && (
            <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent/10 py-3 text-sm font-semibold text-accent">
              <Check className="h-4 w-4" />
              Job completed
            </div>
          )}
        </div>

        {/* Photo upload */}
        <div className="grid gap-4 sm:grid-cols-2">
          <PhotoSection
            title="Before photos"
            photos={beforePhotos}
            onPick={() => beforeRef.current?.click()}
            onRemove={(idx) => setBeforePhotos((p) => p.filter((_, i) => i !== idx))}
          />
          <PhotoSection
            title="After photos"
            photos={afterPhotos}
            onPick={() => afterRef.current?.click()}
            onRemove={(idx) => setAfterPhotos((p) => p.filter((_, i) => i !== idx))}
          />
        </div>
        <input
          ref={beforeRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addPhotos(e.target.files, "before")}
        />
        <input
          ref={afterRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addPhotos(e.target.files, "after")}
        />
      </div>
    </>
  )
}

function PhotoSection({
  title,
  photos,
  onPick,
  onRemove,
}: {
  title: string
  photos: string[]
  onPick: () => void
  onRemove: (idx: number) => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src || "/placeholder.svg"} alt="Job upload" className="h-full w-full object-cover" />
            <button
              onClick={() => onRemove(i)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 rounded-full bg-navy/80 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          onClick={onPick}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Camera className="h-5 w-5" />
          <span className="text-[10px]">Add</span>
        </button>
      </div>
    </div>
  )
}
