"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Loader2, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, TextInput, PasswordInput, Select } from "@/components/auth/form-fields"
import { FileDropzone, type UploadState } from "@/components/auth/file-dropzone"
import { INDIAN_STATES, SKILL_CATEGORIES, EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/india"

const STEPS = ["Personal", "Professional", "Documents"]

type Docs = Record<string, UploadState | undefined>

export default function TechnicianRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Step 1
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // Step 2
  const [skill, setSkill] = useState("")
  const [experience, setExperience] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [shopName, setShopName] = useState("")
  const [shopAddress, setShopAddress] = useState("")

  // Step 3
  const [docs, setDocs] = useState<Docs>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setDoc(key: string, v: UploadState | undefined) {
    setDocs((d) => ({ ...d, [key]: v }))
  }

  function toggleLanguage(lang: string) {
    setLanguages((l) => (l.includes(lang) ? l.filter((x) => x !== lang) : [...l, lang]))
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!name.trim()) e.name = "Enter your full name."
      if (!/^(\+91\s?)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid mobile number."
      if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email."
      if (password.length < 6) e.password = "Password must be at least 6 characters."
      if (password !== confirm) e.confirm = "Passwords do not match."
    } else if (step === 1) {
      if (!skill) e.skill = "Select your skill category."
      if (!experience) e.experience = "Select your experience."
      if (languages.length === 0) e.languages = "Select at least one language."
      if (!state) e.state = "Select your state."
      if (!district.trim()) e.district = "Enter your district."
      if (!city.trim()) e.city = "Enter your city."
      if (!/^\d{6}$/.test(pincode)) e.pincode = "Enter a valid 6-digit pincode."
    } else if (step === 2) {
      const required = ["aadhaar", "address", "iti", "diploma", "experience"]
      const labels: Record<string, string> = {
        aadhaar: "Aadhaar",
        address: "Address proof",
        iti: "ITI certificate",
        diploma: "Diploma certificate",
        experience: "Experience certificate",
      }
      for (const key of required) {
        if (!docs[key]?.done) e[key] = `${labels[key]} is required.`
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (!validateStep()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function back() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  function submit() {
    if (!validateStep()) return
    setSubmitting(true)
    setTimeout(() => router.replace("/verification-pending"), 1100)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">RapidFix</span>
          </Link>
          <Link href="/login/technician" className="text-sm font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Technician registration
        </span>
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Become a RapidFix partner</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete all three steps to submit your application for review.</p>

        {/* Stepper */}
        <div className="mt-7 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-accent text-accent-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full ${i < step ? "bg-accent" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mt-7 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-foreground">Personal details</h2>
                <Field label="Full name" htmlFor="t-name" required error={errors.name}>
                  <TextInput id="t-name" placeholder="e.g. Ravi Kumar" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Phone" htmlFor="t-phone" required error={errors.phone}>
                    <TextInput id="t-phone" placeholder="+91 91234 56780" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Field>
                  <Field label="Email" htmlFor="t-email" required error={errors.email}>
                    <TextInput id="t-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Password" htmlFor="t-pw" required error={errors.password}>
                    <PasswordInput id="t-pw" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Field>
                  <Field label="Confirm password" htmlFor="t-cpw" required error={errors.confirm}>
                    <PasswordInput id="t-cpw" placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </Field>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-foreground">Professional details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Skill category" htmlFor="t-skill" required error={errors.skill}>
                    <Select id="t-skill" value={skill} onChange={(e) => setSkill(e.target.value)}>
                      <option value="">Select skill</option>
                      {SKILL_CATEGORIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Experience" htmlFor="t-exp" required error={errors.experience}>
                    <Select id="t-exp" value={experience} onChange={(e) => setExperience(e.target.value)}>
                      <option value="">Select experience</option>
                      {EXPERIENCE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field label="Languages known" required error={errors.languages}>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const active = languages.includes(lang)
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {lang}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <p className="text-sm font-semibold text-foreground">Service area</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="State" htmlFor="t-state" required error={errors.state}>
                    <Select id="t-state" value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="District" htmlFor="t-district" required error={errors.district}>
                    <TextInput id="t-district" placeholder="e.g. Jaipur" value={district} onChange={(e) => setDistrict(e.target.value)} />
                  </Field>
                  <Field label="City" htmlFor="t-city" required error={errors.city}>
                    <TextInput id="t-city" placeholder="e.g. Jaipur" value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                  <Field label="Pincode" htmlFor="t-pin" required error={errors.pincode}>
                    <TextInput id="t-pin" inputMode="numeric" maxLength={6} placeholder="302001" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Shop name" htmlFor="t-shop" hint="Optional">
                    <TextInput id="t-shop" placeholder="e.g. Ravi Electricals" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                  </Field>
                  <Field label="Shop address" htmlFor="t-shopaddr" hint="Optional">
                    <TextInput id="t-shopaddr" placeholder="Shop location" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
                  </Field>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-foreground">Document verification</h2>
                <p className="text-sm text-muted-foreground">Upload clear scans or photos. These are reviewed by our verification team.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FileDropzone label="Aadhaar card" required value={docs.aadhaar} onChange={(v) => setDoc("aadhaar", v)} />
                    {errors.aadhaar && <p className="mt-1 text-xs font-medium text-destructive">{errors.aadhaar}</p>}
                  </div>
                  <div>
                    <FileDropzone label="Address proof" required value={docs.address} onChange={(v) => setDoc("address", v)} />
                    {errors.address && <p className="mt-1 text-xs font-medium text-destructive">{errors.address}</p>}
                  </div>
                  <div>
                    <FileDropzone label="ITI certificate" required value={docs.iti} onChange={(v) => setDoc("iti", v)} />
                    {errors.iti && <p className="mt-1 text-xs font-medium text-destructive">{errors.iti}</p>}
                  </div>
                  <div>
                    <FileDropzone label="Diploma certificate" required value={docs.diploma} onChange={(v) => setDoc("diploma", v)} />
                    {errors.diploma && <p className="mt-1 text-xs font-medium text-destructive">{errors.diploma}</p>}
                  </div>
                  <div>
                    <FileDropzone label="Experience certificate" required value={docs.experience} onChange={(v) => setDoc("experience", v)} />
                    {errors.experience && <p className="mt-1 text-xs font-medium text-destructive">{errors.experience}</p>}
                  </div>
                  <FileDropzone label="Shop license" value={docs.license} onChange={(v) => setDoc("license", v)} />
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
                  <ShieldCheck className="h-4 w-4" />
                  Documents are encrypted and used only for verification.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={step === 0}
            className="h-12 gap-1 rounded-xl px-5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} className="h-12 gap-1 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={submitting} className="h-12 gap-1 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit application"}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
