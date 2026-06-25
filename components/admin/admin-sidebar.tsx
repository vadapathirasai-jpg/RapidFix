"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Wrench,
  ClipboardList,
  Star,
  LogOut,
  Zap,
} from "lucide-react"
import { clearSession } from "@/lib/auth"

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
  { label: "Technicians", href: "/admin/technicians", icon: Wrench },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearSession()
    router.push("/login/admin")
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-secondary md:flex">
      <Link href="/admin" className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
        </span>
        <div className="leading-tight">
          <span className="block text-lg font-bold tracking-tight text-white">RapidFix</span>
          <span className="block text-xs text-white/50">Admin Console</span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 border-t border-white/10 px-6 py-4 text-sm font-medium text-white/70 transition-colors hover:text-white"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  )
}
