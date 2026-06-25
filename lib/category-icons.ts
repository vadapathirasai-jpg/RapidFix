import { Zap, Droplet, Wrench, Wind, Hammer, Smartphone, WashingMachine, Sprout, LayoutGrid } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const categoryIcons: Record<string, LucideIcon> = {
  All: LayoutGrid,
  Electrician: Zap,
  Plumber: Droplet,
  Mechanic: Wrench,
  "AC Repair": Wind,
  Carpenter: Hammer,
  "Mobile Repair": Smartphone,
  Appliance: WashingMachine,
  Agricultural: Sprout,
}

export const iconByName: Record<string, LucideIcon> = {
  Zap,
  Droplet,
  Wrench,
  Wind,
  Hammer,
}
