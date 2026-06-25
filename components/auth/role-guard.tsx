"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSession } from "@/components/auth/auth-provider"
import { ROLE_HOME, type Role } from "@/lib/auth"

/** Client-side route protection. Redirects unauthenticated users to the
 *  correct login page, and users with the wrong role to their own home. */
export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace(`/login/${role}`)
    } else if (user.role !== role) {
      router.replace(ROLE_HOME[user.role])
    }
  }, [loading, user, role, router])

  if (loading || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
