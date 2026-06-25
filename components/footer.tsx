import { Zap, Globe, MessageCircle, Send, Mail } from "lucide-react"

const columns = [
  {
    title: "Services",
    links: ["Electrician", "Plumber", "Mechanic", "AC Repair", "Mobile Repair"],
  },
  {
    title: "Company",
    links: ["About us", "How it works", "Careers", "Press", "Contact"],
  },
  {
    title: "For Technicians",
    links: ["Become a Technician", "Partner app", "Earnings", "Support"],
  },
]

const socials = [Globe, MessageCircle, Send, Mail]

export function Footer() {
  return (
    <footer id="technician" className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap
                  className="h-5 w-5 text-primary-foreground"
                  fill="currentColor"
                />
              </span>
              <span className="text-xl font-bold">RapidFix</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Fast, trusted and local emergency technician dispatch for every
              corner of rural India.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/60 transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} RapidFix. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
