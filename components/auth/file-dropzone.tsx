"use client"

import { useRef, useState, type DragEvent } from "react"
import { UploadCloud, FileCheck2, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadState {
  name: string
  progress: number
  done: boolean
}

export function FileDropzone({
  label,
  required,
  value,
  onChange,
}: {
  label: string
  required?: boolean
  value?: UploadState
  onChange: (state: UploadState | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function simulateUpload(file: File) {
    onChange({ name: file.name, progress: 0, done: false })
    let progress = 0
    const timer = setInterval(() => {
      progress += Math.random() * 28 + 12
      if (progress >= 100) {
        clearInterval(timer)
        onChange({ name: file.name, progress: 100, done: true })
      } else {
        onChange({ name: file.name, progress: Math.round(progress), done: false })
      }
    }, 220)
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) simulateUpload(file)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (value) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </span>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              value.done ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary",
            )}
          >
            {value.done ? <FileCheck2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{value.name}</p>
            {value.done ? (
              <p className="text-xs font-medium text-accent">Uploaded</p>
            ) : (
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value.progress}%` }} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={`Remove ${label}`}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Drag &amp; drop or browse</span>
        <span className="text-xs text-muted-foreground">PDF, JPG or PNG · up to 5 MB</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </button>
    </div>
  )
}
