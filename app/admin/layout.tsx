import type { ReactNode } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">{children}</main>
      </div>
    </RoleGuard>
  )
}
