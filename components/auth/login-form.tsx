"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import { Field, TextInput, PasswordInput, Checkbox } from "@/components/auth/form-fields"
import { useSession } from "@/components/auth/auth-provider"
import { mockLogin, ROLE_HOME, ROLE_LABEL, type Role } from "@/lib/auth"

const COPY: Record<Role, { subtitle: string; title: string; hint: string }> = {
  customer: {
    subtitle: "Customer login",
    title: "Welcome back",
    hint: "Demo: aarav@example.com / rapidfix",
  },
  technician: {
    subtitle: "Technician login",
    title: "Partner sign in",
    hint: "Demo: ravi@example.com / rapidfix",
  },
  admin: {
    subtitle: "Admin login",
    title: "Operations console",
    hint: "Demo: admin@rapidfix.in / rapidfix",
  },
}

export function LoginForm({ role }: { role: Role }) {
  const router = useRouter()
  const { login } = useSession()
  const copy = COPY[role]

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    // Simulate a network round-trip.
    setTimeout(() => {
      const res = mockLogin(identifier, password, role)
      if (!res.ok || !res.user) {
        setError(res.error ?? "Unable to sign in.")
        setLoading(false)
        return
      }
      login(res.user)
      router.replace(ROLE_HOME[role])
    }, 650)
  }

  return (
    <AuthShell
      subtitle={copy.subtitle}
      title={copy.title}
      accent={role === "admin" ? "secondary" : "primary"}
      footer={
        role === "admin" ? (
          <span>Restricted access for RapidFix operations staff.</span>
        ) : role === "technician" ? (
          <span>
            New partner?{" "}
            <Link href="/register/technician" className="font-semibold text-primary hover:underline">
              Apply to join
            </Link>
          </span>
        ) : (
          <span>
            New to RapidFix?{" "}
            <Link href="/register/customer" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </span>
        )
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email or phone" htmlFor="identifier" required hint={copy.hint}>
          <TextInput
            id="identifier"
            autoComplete="username"
            placeholder="you@example.com or +91…"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </Field>

        <Field label="Password" htmlFor="password" required>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" checked={remember} onChange={setRemember} label="Remember me" />
          <Link href={`/forgot-password/${role}`} className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Sign in as ${ROLE_LABEL[role]}`}
        </Button>

        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <Link href="/login/customer" className={role === "customer" ? "font-semibold text-primary" : "hover:text-foreground"}>
            Customer
          </Link>
          <span aria-hidden>·</span>
          <Link href="/login/technician" className={role === "technician" ? "font-semibold text-primary" : "hover:text-foreground"}>
            Technician
          </Link>
          <span aria-hidden>·</span>
          <Link href="/login/admin" className={role === "admin" ? "font-semibold text-primary" : "hover:text-foreground"}>
            Admin
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}
