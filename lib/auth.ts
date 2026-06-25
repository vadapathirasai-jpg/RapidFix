export type Role = "customer" | "technician" | "admin"

export interface SessionUser {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  verified?: boolean
}

/** Where each role lands after authentication. */
export const ROLE_HOME: Record<Role, string> = {
  customer: "/services",
  technician: "/dashboard",
  admin: "/admin",
}

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
}

/* ------------------------------------------------------------------ */
/* Mock accounts — used until a real auth backend is connected.        */
/* Any password with 6+ characters is accepted for the demo accounts.  */
/* ------------------------------------------------------------------ */

export const MOCK_USERS: (SessionUser & { password: string })[] = [
  {
    id: "USER001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    role: "customer",
    password: "rapidfix",
  },
  {
    id: "TECH001",
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "+91 91234 56780",
    role: "technician",
    verified: true,
    password: "rapidfix",
  },
  {
    id: "ADMIN001",
    name: "Priya Nair",
    email: "admin@rapidfix.in",
    phone: "+91 90000 00000",
    role: "admin",
    password: "rapidfix",
  },
]

const STORAGE_KEY = "rapidfix.session"

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function setSession(user: SessionUser) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  // Mirror to a cookie so other tabs / future middleware can read role.
  document.cookie = `rapidfix_role=${user.role}; path=/; max-age=604800`
  window.dispatchEvent(new Event("rapidfix-auth"))
}

export function clearSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  document.cookie = "rapidfix_role=; path=/; max-age=0"
  window.dispatchEvent(new Event("rapidfix-auth"))
}

export interface LoginResult {
  ok: boolean
  user?: SessionUser
  error?: string
}

/** Mock credential check. Accepts the seeded account for the role, or any
 *  email/phone with a 6+ char password (so reviewers can log in freely). */
export function mockLogin(identifier: string, password: string, role: Role): LoginResult {
  if (!identifier.trim()) return { ok: false, error: "Enter your email or phone number." }
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." }

  const seeded = MOCK_USERS.find(
    (u) => u.role === role && (u.email === identifier.trim().toLowerCase() || u.phone === identifier.trim()),
  )

  if (seeded) {
    const { password: _pw, ...user } = seeded
    return { ok: true, user }
  }

  // Fallback demo user for the chosen role.
  const fallback = MOCK_USERS.find((u) => u.role === role)!
  const { password: _pw, ...base } = fallback
  return {
    ok: true,
    user: { ...base, email: identifier.includes("@") ? identifier.trim() : base.email },
  }
}
