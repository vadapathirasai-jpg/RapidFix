import type { ReactNode } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { TechnicianAppProvider } from "@/components/technician/app-context"
import { Sidebar, BottomNav } from "@/components/technician/app-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="technician">
      <TechnicianAppProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <BottomNav />
        </div>
      </TechnicianAppProvider>
    </RoleGuard>
  )
}
