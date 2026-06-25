"use client"

import { useCallback, useEffect, useState } from "react"
import { clearSession, getSession, setSession, type SessionUser } from "@/lib/auth"

/** Provider-free session hook. Reads the mock session from storage and keeps
 *  every component in sync via the custom "rapidfix-auth" event. */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getSession())
    setLoading(false)
    const sync = () => setUser(getSession())
    window.addEventListener("rapidfix-auth", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("rapidfix-auth", sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const login = useCallback((next: SessionUser) => {
    setSession(next)
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return { user, loading, login, logout }
}
