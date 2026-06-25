"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Siren, Moon, Globe, LogOut, Volume2, MessageSquare } from "lucide-react"
import { PageHeader } from "@/components/technician/page-header"

const languages = ["English", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? "bg-accent" : "bg-muted-foreground/40"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${on ? "right-1" : "left-1"}`}
      />
    </button>
  )
}

function Row({
  icon: Icon,
  label,
  desc,
  children,
}: {
  icon: typeof Bell
  label: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-card-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [pushNotif, setPushNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [emergencyAlerts, setEmergencyAlerts] = useState(true)
  const [alertSound, setAlertSound] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("English")

  return (
    <>
      <PageHeader title="Settings" subtitle="Preferences & account" />

      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
        {/* Notifications */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold text-foreground">Notifications</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            <Row icon={Bell} label="Push notifications" desc="Job updates and reminders">
              <Toggle on={pushNotif} onChange={setPushNotif} />
            </Row>
            <Row icon={MessageSquare} label="SMS notifications" desc="Receive texts for new jobs">
              <Toggle on={smsNotif} onChange={setSmsNotif} />
            </Row>
          </div>
        </section>

        {/* Emergency preferences */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold text-foreground">Emergency alerts</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            <Row icon={Siren} label="Emergency requests" desc="Receive high-priority SOS jobs">
              <Toggle on={emergencyAlerts} onChange={setEmergencyAlerts} />
            </Row>
            <Row icon={Volume2} label="Alert sound" desc="Play a loud sound for emergencies">
              <Toggle on={alertSound} onChange={setAlertSound} />
            </Row>
          </div>
        </section>

        {/* Appearance + Language */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold text-foreground">Preferences</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            <Row icon={Moon} label="Dark mode" desc="Easier on the eyes at night">
              <Toggle on={darkMode} onChange={setDarkMode} />
            </Row>
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Globe className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-card-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">Choose your app language</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      language === l
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Logout */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emergency/30 bg-emergency/5 py-4 text-sm font-semibold text-emergency transition-colors hover:bg-emergency/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>

        <p className="pb-2 text-center text-xs text-muted-foreground">RapidFix Technician · v1.0.0</p>
      </div>
    </>
  )
}
