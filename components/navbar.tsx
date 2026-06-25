"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/components/auth/auth-provider"

const links = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Become a Technician", href: "#technician" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout } = useSession()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </span>
          <span
            className={`text-xl font-bold tracking-tight ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            RapidFix
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-muted-foreground" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <Button
                variant="ghost"
                className={`hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white hover:bg-white/10"
                }`}
                onClick={() => {
                  logout()
                  router.push("/")
                }}
              >
                Logout
              </Button>
              <Link href={user.role === "technician" ? "/technician-app" : user.role === "admin" ? "/admin" : "/customer-app"} className="contents">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login/customer" className="contents">
                <Button
                  variant="ghost"
                  className={`hover:text-primary ${
                    scrolled ? "text-foreground" : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup/customer" className="contents">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="rounded-lg px-3 py-2 text-sm font-medium text-foreground">
                    {user.name || user.email}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      logout()
                      setOpen(false)
                      router.push("/")
                    }}
                  >
                    Logout
                  </Button>
                  <Link href={user.role === "technician" ? "/technician-app" : user.role === "admin" ? "/admin" : "/customer-app"} className="contents">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(false)}>
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login/customer" className="contents">
                    <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup/customer" className="contents">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(false)}>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
