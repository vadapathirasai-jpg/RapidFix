"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  Star,
  User,
  BadgeCheck,
  Settings,
  LogOut,
  Zap,
} from "lucide-react"
import { useTechnicianApp } from "./app-context"
import { useSession } from "@/components/auth/auth-provider"

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Earnings", href: "/dashboard/earnings", icon: Wallet },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Verification", href: "/dashboard/verification", icon: BadgeCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const mobileItems = navItems.slice(0, 5)

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname.startsWith(href)
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { technician, online } = useTechnicianApp()
  const { logout } = useSession()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy md:flex">
      <Link href="/" className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">RapidFix</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={technician?.photo || "/technician-avatar.png"}
            alt={technician?.name ?? "Technician"}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {technician?.name ?? "Technician"}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                online ? "text-accent" : "text-white/50"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${online ? "bg-accent" : "bg-white/40"}`}
              />
              {online ? "Online" : "Offline"}
            </span>
          </div>
          <button
            onClick={() => {
              logout()
              router.push("/")
            }}
            aria-label="Log out"
            className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/10 bg-navy px-2 py-2 md:hidden">
      {mobileItems.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors ${
              active ? "text-primary" : "text-white/60"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
