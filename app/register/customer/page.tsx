"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import { Field, TextInput, PasswordInput, Select, Checkbox } from "@/components/auth/form-fields"
import { INDIAN_STATES } from "@/lib/india"

interface Form {
  name: string
  email: string
  phone: string
  password: string
  confirm: string
  address: string
  city: string
  state: string
  pincode: string
}

const empty: Form = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
}

export default function CustomerRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<Form>(empty)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "terms", string>>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate() {
    const e: Partial<Record<keyof Form | "terms", string>> = {}
    if (!form.name.trim()) e.name = "Enter your full name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address."
    if (!/^(\+91\s?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number."
    if (form.password.length < 6) e.password = "Password must be at least 6 characters."
    if (form.password !== form.confirm) e.confirm = "Passwords do not match."
    if (!form.address.trim()) e.address = "Enter your address."
    if (!form.city.trim()) e.city = "Enter your city."
    if (!form.state) e.state = "Select your state."
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode."
    if (!terms) e.terms = "Please accept the Terms & Conditions."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => router.replace("/login/customer"), 1800)
    }, 900)
  }

  if (done) {
    return (
      <AuthShell subtitle="Customer registration" title="Account created!">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </span>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Welcome to RapidFix, {form.name.split(" ")[0]}! Redirecting you to sign in…
          </p>
          <Loader2 className="mt-4 h-5 w-5 animate-spin text-primary" />
        </motion.div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      subtitle="Customer registration"
      title="Create your account"
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login/customer" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name" htmlFor="name" required error={errors.name}>
          <TextInput id="name" placeholder="e.g. Aarav Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" required error={errors.email}>
            <TextInput id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
            <TextInput id="phone" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Password" htmlFor="password" required error={errors.password}>
            <PasswordInput id="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </Field>
          <Field label="Confirm password" htmlFor="confirm" required error={errors.confirm}>
            <PasswordInput id="confirm" placeholder="Re-enter password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
          </Field>
        </div>
        <Field label="Address" htmlFor="address" required error={errors.address}>
          <TextInput id="address" placeholder="House no, street, area" value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="City" htmlFor="city" required error={errors.city}>
            <TextInput id="city" placeholder="Jaipur" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label="State" htmlFor="state" required error={errors.state}>
            <Select id="state" value={form.state} onChange={(e) => set("state", e.target.value)}>
              <option value="">Select</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pincode" htmlFor="pincode" required error={errors.pincode}>
            <TextInput id="pincode" inputMode="numeric" maxLength={6} placeholder="302001" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
          </Field>
        </div>

        <Checkbox
          id="terms"
          checked={terms}
          onChange={setTerms}
          label={
            <>
              I agree to the{" "}
              <span className="font-semibold text-primary">Terms &amp; Conditions</span> and{" "}
              <span className="font-semibold text-primary">Privacy Policy</span>.
            </>
          }
        />
        {errors.terms && <p className="-mt-2 text-xs font-medium text-destructive">{errors.terms}</p>}

        <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  )
}
