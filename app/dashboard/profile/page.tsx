"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Star,
  BadgeCheck,
  Phone,
  Briefcase,
  MapPin,
  Languages,
  Pencil,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Settings,
} from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"
import { Button } from "@/components/ui/button"
import { useTechnicianApp } from "@/components/technician/app-context"
import { profileExtras } from "@/lib/technician-app"

export default function ProfilePage() {
  const { technician } = useTechnicianApp()
  const [editing, setEditing] = useState(false)

  const [areas, setAreas] = useState(profileExtras.serviceAreas.join(", "))
  const [languages, setLanguages] = useState(profileExtras.languages.join(", "))
  const [experience, setExperience] = useState(String(profileExtras.experienceYears))
  const [phone, setPhone] = useState(technician?.phone ?? "+91 98765 43210")

  const areaList = areas.split(",").map((a) => a.trim()).filter(Boolean)
  const langList = languages.split(",").map((l) => l.trim()).filter(Boolean)

  return (
    <>
      <PageHeader
        title="Profile"
        action={
          <Button
            size="sm"
            variant={editing ? "default" : "outline"}
            onClick={() => setEditing((e) => !e)}
            className="h-9 gap-1.5 rounded-lg"
          >
            {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? "Save" : "Edit"}
          </Button>
        }
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl bg-navy p-6 text-center text-white"
        >
          <div className="relative">
            <Image
              src={technician?.photo || "/technician-avatar.png"}
              alt={technician?.name ?? "Technician"}
              width={88}
              height={88}
              className="h-22 w-22 rounded-full object-cover ring-4 ring-white/10"
            />
            {editing && (
              <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <h2 className="mt-3 text-xl font-bold">{technician?.name ?? "Technician"}</h2>
          <p className="text-sm text-white/70">{technician?.category ?? "Field Technician"}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {technician ? technician.rating.toFixed(1) : "—"}
            </span>
          </div>
        </motion.div>

        {/* Details */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">Details</h3>
          <div className="flex flex-col gap-4">
            <Field icon={Briefcase} label="Experience">
              {editing ? (
                <EditInput value={experience} onChange={setExperience} suffix="years" />
              ) : (
                <span>{experience} years</span>
              )}
            </Field>

            <Field icon={Phone} label="Phone">
              {editing ? (
                <EditInput value={phone} onChange={setPhone} />
              ) : (
                <span>{phone}</span>
              )}
            </Field>

            <Field icon={MapPin} label="Service areas">
              {editing ? (
                <EditInput value={areas} onChange={setAreas} />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {areaList.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </Field>

            <Field icon={Languages} label="Languages">
              {editing ? (
                <EditInput value={languages} onChange={setLanguages} />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {langList.map((l) => (
                    <span
                      key={l}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          {editing && (
            <Button
              variant="ghost"
              onClick={() => setEditing(false)}
              className="mt-4 w-full gap-1.5 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {/* Links */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <ProfileLink href="/dashboard/verification" icon={ShieldCheck} label="Verification Center" />
          <ProfileLink href="/dashboard/settings" icon={Settings} label="Settings" border />
        </div>
      </div>
    </>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Star
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-card-foreground">{children}</div>
      </div>
    </div>
  )
}

function EditInput({
  value,
  onChange,
  suffix,
}: {
  value: string
  onChange: (v: string) => void
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  )
}

function ProfileLink({
  href,
  icon: Icon,
  label,
  border,
}: {
  href: string
  icon: typeof Star
  label: string
  border?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted ${
        border ? "border-t border-border" : ""
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-card-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  )
}
