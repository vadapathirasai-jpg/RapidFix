import type { Technician, Review } from "@/lib/technicians"

// Same-origin proxy path (see rewrites in next.config.mjs). Routing through our
// own origin avoids the preview's content-security-policy blocking direct
// cross-origin requests to the AWS API.
export const API_BASE = "/api/backend"

// Demo identity used by the app until real auth is wired up.
export const DEMO_USER_ID = "USER001"

/* ------------------------------------------------------------------ */
/* Raw API response shapes                                            */
/* ------------------------------------------------------------------ */

export type ApiTechnician = {
  technicianId: string
  name: string
  skill: string
  rating: number
  available: boolean
  phone: string
}

export type ApiBooking = {
  bookingId: string
  userId: string
  technicianId: string
  status: string
  issue?: string
  serviceType?: string
  createdAt: string
}

export type ApiReview = {
  reviewId: string
  technicianId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}

export type ApiAverage = {
  technicianId: string
  totalReviews: number
  averageRating: number
}

export type ApiUser = {
  userId: string
  name: string
  phone: string
  role: string
}

/* ------------------------------------------------------------------ */
/* Generic fetch helpers                                              */
/* ------------------------------------------------------------------ */

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

async function mutate<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

/* ------------------------------------------------------------------ */
/* Deterministic display-field derivation                            */
/* The backend only stores name/skill/rating/available/phone, so we  */
/* derive the richer UI fields from a stable hash of the id.         */
/* ------------------------------------------------------------------ */

function seedFrom(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

const skillMeta: Record<
  string,
  { icon: string; photo: string; basePrice: number; skills: string[]; certs: string[] }
> = {
  Electrician: {
    icon: "Zap",
    photo: "/technician-avatar.png",
    basePrice: 299,
    skills: ["Wiring", "Switchboard", "Motor Repair", "Inverter Setup", "Fault Finding"],
    certs: ["ITI Electrician Certified", "Govt. Licensed Wireman", "Safety Training Level 2"],
  },
  Plumber: {
    icon: "Droplet",
    photo: "/tech-plumber.png",
    basePrice: 249,
    skills: ["Leak Repair", "Pipe Fitting", "Tank Setup", "Bathroom Fitting", "Drainage"],
    certs: ["Certified Plumber", "Water Systems Specialist"],
  },
  Mechanic: {
    icon: "Wrench",
    photo: "/tech-mechanic.png",
    basePrice: 399,
    skills: ["Engine Repair", "Servicing", "Brake Work", "Tractor Repair", "Roadside Help"],
    certs: ["Automobile Mechanic Diploma", "Tractor Service Certified"],
  },
  "AC Repair": {
    icon: "Wind",
    photo: "/tech-ac.png",
    basePrice: 499,
    skills: ["AC Install", "Gas Refill", "Deep Cleaning", "Compressor Repair", "Servicing"],
    certs: ["HVAC Certified", "Refrigeration Technician License"],
  },
  Carpenter: {
    icon: "Hammer",
    photo: "/tech-carpenter.png",
    basePrice: 349,
    skills: ["Furniture", "Door Fitting", "Cabinets", "Polishing", "Repairs"],
    certs: ["Master Carpenter", "Woodwork Specialist"],
  },
}

const defaultMeta = skillMeta.Electrician

export function mapTechnician(api: ApiTechnician, average?: ApiAverage): Technician {
  const meta = skillMeta[api.skill] ?? defaultMeta
  const seed = seedFrom(api.technicianId)

  const distance = Math.round((0.5 + (seed % 40) / 10) * 10) / 10
  const jobs = 200 + (seed % 1200)
  const reviews = average?.totalReviews ?? 20 + (seed % 300)
  const startingPrice = meta.basePrice + (seed % 5) * 10
  const experience = `${4 + (seed % 12)} years`
  const rating = average?.averageRating ?? api.rating

  return {
    id: api.technicianId,
    name: api.name,
    photo: meta.photo,
    category: api.skill,
    icon: meta.icon,
    rating: Math.round(rating * 10) / 10,
    reviews,
    jobs,
    distance,
    startingPrice,
    available: api.available,
    emergency: api.available && seed % 2 === 0,
    topRated: rating >= 4.7,
    experience,
    about: `${api.name} is a verified ${api.skill.toLowerCase()} serving customers across the local area, with a strong track record of reliable, on-time service and transparent pricing. Reachable at ${api.phone}.`,
    skills: meta.skills,
    certifications: meta.certs,
    reviewList: [],
    phone: api.phone,
  }
}

export function mapReviews(api: ApiReview[]): Review[] {
  return [...api]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => ({
      name: friendlyUser(r.userId),
      rating: r.rating,
      date: relativeTime(r.createdAt),
      text: r.comment,
    }))
}

export function friendlyUser(userId: string) {
  const num = userId.replace(/[^0-9]/g, "")
  return num ? `Customer ${num}` : "Verified Customer"
}

export function relativeTime(iso: string) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Date.now() - then
  const day = 86_400_000
  if (diff < day) return "Today"
  if (diff < 2 * day) return "Yesterday"
  const days = Math.floor(diff / day)
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? "s" : ""} ago`
}

/* ------------------------------------------------------------------ */
/* Endpoint URLs (for SWR keys)                                       */
/* ------------------------------------------------------------------ */

export const endpoints = {
  technicians: `${API_BASE}/technicians`,
  technician: (id: string) => `${API_BASE}/technicians/${id}`,
  reviews: (id: string) => `${API_BASE}/reviews/${id}`,
  average: (id: string) => `${API_BASE}/reviews/average/${id}`,
  userBookings: (userId: string) => `${API_BASE}/bookings/user/${userId}`,
  emergency: (id: string) => `${API_BASE}/emergency/${id}`,
  user: (userId: string) => `${API_BASE}/users/${userId}`,
}

/* ------------------------------------------------------------------ */
/* Mutations                                                          */
/* ------------------------------------------------------------------ */

export function createBooking(input: { userId: string; technicianId: string; serviceType: string; issue?: string }) {
  return mutate<ApiBooking>("/bookings", "POST", input)
}

export function acceptBooking(bookingId: string) {
  return mutate("/bookings/accept", "PUT", { bookingId })
}

export function cancelBooking(bookingId: string) {
  return mutate("/bookings/cancel", "PUT", { bookingId })
}

export function createEmergency(input: { userId: string; issue: string }) {
  return mutate<{ requestId: string }>("/emergency", "POST", input)
}

export function acceptEmergency(requestId: string, technicianId: string) {
  return mutate("/emergency/accept", "PUT", { requestId, technicianId })
}

export function cancelEmergency(requestId: string) {
  return mutate("/emergency/cancel", "PUT", { requestId })
}

export function createReview(input: { bookingId: string; technicianId: string; rating: number; comment: string }) {
  return mutate<ApiReview>("/reviews", "POST", input)
}
