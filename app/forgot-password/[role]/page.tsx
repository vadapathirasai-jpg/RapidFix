"use client"

import { use, useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import { Field, TextInput, PasswordInput } from "@/components/auth/form-fields"
import { ROLE_LABEL, type Role } from "@/lib/auth"

type Step = "request" | "otp" | "reset" | "success"
const VALID_ROLES: Role[] = ["customer", "technician", "admin"]

export default function ForgotPasswordPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: rawRole } = use(params)
  const role = (VALID_ROLES.includes(rawRole as Role) ? rawRole : "customer") as Role
  const router = useRouter()

  const [step, setStep] = useState<Step>("request")
  const [identifier, setIdentifier] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  function sendOtp(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!identifier.trim()) return setError("Enter your registered email or phone.")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("otp")
      setSeconds(30)
    }, 700)
  }

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < 3) otpRefs.current[i + 1]?.focus()
  }

  function verifyOtp(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (otp.join("").length < 4) return setError("Enter the 4-digit code we sent you.")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("reset")
    }, 700)
  }

  function resetPassword(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (password.length < 6) return setError("Password must be at least 6 characters.")
    if (password !== confirm) return setError("Passwords do not match.")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("success")
    }, 800)
  }

  const subtitle = `${ROLE_LABEL[role]} account recovery`

  return (
    <AuthShell
      subtitle={subtitle}
      title={
        step === "request"
          ? "Reset your password"
          : step === "otp"
            ? "Verify your identity"
            : step === "reset"
              ? "Create a new password"
              : "All set!"
      }
      accent={role === "admin" ? "secondary" : "primary"}
      footer={
        step !== "success" && (
          <Link href={`/login/${role}`} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        )
      }
    >
      <AnimatePresence mode="wait">
        {step === "request" && (
          <motion.form
            key="request"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={sendOtp}
            className="flex flex-col gap-4"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Enter the email or phone number linked to your account and we&apos;ll send a 4-digit verification code.
            </p>
            <Field label="Email or phone" htmlFor="identifier" required error={error}>
              <TextInput
                id="identifier"
                placeholder="you@example.com or +91…"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send code"}
            </Button>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={verifyOtp}
            className="flex flex-col gap-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              We sent a 4-digit code to <span className="font-semibold text-foreground">{identifier}</span>. Use{" "}
              <span className="font-semibold text-foreground">1234</span> for this demo.
            </p>
            <div className="flex justify-center gap-3">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
                  }}
                  className="h-14 w-14 rounded-xl border border-border bg-background text-center text-xl font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>
            {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify code"}
            </Button>
            <button
              type="button"
              disabled={seconds > 0}
              onClick={() => setSeconds(30)}
              className="text-center text-sm font-medium text-muted-foreground disabled:opacity-60"
            >
              {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
            </button>
          </motion.form>
        )}

        {step === "reset" && (
          <motion.form
            key="reset"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={resetPassword}
            className="flex flex-col gap-4"
          >
            <Field label="New password" htmlFor="new-password" required>
              <PasswordInput id="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field label="Confirm password" htmlFor="confirm-password" required error={error}>
              <PasswordInput id="confirm-password" placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update password"}
            </Button>
          </motion.form>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15"
            >
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </motion.span>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => router.replace(`/login/${role}`)}
              className="mt-6 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Back to login
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  )
}
