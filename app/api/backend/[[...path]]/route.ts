import { NextRequest } from "next/server"
import {
  adminStats,
  getBackendState,
  notifications,
  toApiBooking,
  type EmergencyRecord,
} from "@/lib/backend-store"
import type { Booking, CustomerProfile, TechnicianProfile } from "@/lib/services"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ path?: string[] }>
}

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

function notFound(message = "Not found") {
  return json({ error: message }, { status: 404 })
}

function badRequest(message: string) {
  return json({ error: message }, { status: 400 })
}

function nextId(prefix: string, existing: string[]) {
  const max = existing.reduce((n, id) => {
    const digits = Number(id.replace(/\D/g, ""))
    return Number.isFinite(digits) ? Math.max(n, digits) : n
  }, 0)
  return `${prefix}${String(max + 1).padStart(4, "0")}`
}

async function body<T>(req: NextRequest): Promise<Partial<T>> {
  try {
    return (await req.json()) as Partial<T>
  } catch {
    return {}
  }
}

function averageFor(technicianId: string) {
  const state = getBackendState()
  const reviews = state.reviews.filter((r) => r.technicianId === technicianId)
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
      : state.technicians.find((t) => t.technicianId === technicianId)?.rating ?? 0

  return {
    technicianId,
    totalReviews: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
  }
}

function publicAdminBookings() {
  const state = getBackendState()
  return state.bookings.map((b) => {
    const customer = state.customers.find((c) => c.id === b.customerId)
    const technician = state.technicians.find((t) => t.technicianId === b.technicianId)
    return {
      id: b.id,
      customer: customer?.name ?? b.customerId,
      technician: technician?.name ?? b.technicianId ?? "Unassigned",
      service: b.service,
      amount: b.amount,
      status:
        b.status === "completed"
          ? "Completed"
          : b.status === "cancelled"
            ? "Cancelled"
            : "In Progress",
      date: b.scheduledDate,
    }
  })
}

function publicAdminTechnicians() {
  const state = getBackendState()
  return state.technicians.map((t) => {
    const profile = state.technicianProfiles.find((p) => p.id === t.technicianId)
    return {
      id: t.technicianId,
      name: t.name,
      skill: t.skill,
      city: profile?.city ?? "Jaipur",
      rating: averageFor(t.technicianId).averageRating || t.rating,
      jobs: profile?.completedBookings ?? 0,
      status: profile?.verificationStatus === "verified" ? "Verified" : "Pending",
    }
  })
}

function getBooking(id: string) {
  return getBackendState().bookings.find((b) => b.id === id)
}

function bookingFromRequest(input: Partial<Booking> & Record<string, unknown>): Booking {
  const state = getBackendState()
  const id = nextId("BK-", state.bookings.map((b) => b.id))
  const now = new Date().toISOString()
  const service = String(input.service ?? input.serviceType ?? "General Visit")
  const customerId = String(input.customerId ?? input.userId ?? "USER001")
  const technicianId = typeof input.technicianId === "string" ? input.technicianId : undefined

  return {
    id,
    customerId,
    technicianId,
    service,
    description: String(input.description ?? input.issue ?? service),
    status: input.status ?? "pending",
    scheduledDate: String(input.scheduledDate ?? "Today"),
    location: String(input.location ?? "Customer address"),
    amount: Number(input.amount ?? 0),
    rating: typeof input.rating === "number" ? input.rating : undefined,
    review: typeof input.review === "string" ? input.review : undefined,
    createdAt: now,
    updatedAt: now,
  }
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const state = getBackendState()
  const path = (await ctx.params).path ?? []
  const [resource, a, b] = path

  if (!resource) return json({ ok: true, service: "RapidFix local backend" })

  if (resource === "technicians") {
    if (!a) return json(state.technicians)
    if (a === "profile" && b) {
      const profile = state.technicianProfiles.find((p) => p.id === b)
      return profile ? json(profile) : notFound("Technician profile not found")
    }
    if (b === "bookings") {
      return json(state.bookings.filter((booking) => booking.technicianId === a))
    }
    if (b === "available-bookings") {
      const profile = state.technicianProfiles.find((p) => p.id === a)
      return json(
        state.bookings.filter(
          (booking) =>
            !booking.technicianId &&
            booking.status === "pending" &&
            (!profile || booking.location.includes(profile.city)),
        ),
      )
    }
    const tech = state.technicians.find((t) => t.technicianId === a)
    return tech ? json(tech) : notFound("Technician not found")
  }

  if (resource === "reviews") {
    if (a === "average" && b) return json(averageFor(b))
    if (!a) return json(state.reviews)
    return json(state.reviews.filter((r) => r.technicianId === a))
  }

  if (resource === "bookings") {
    if (a === "user" && b) return json(state.bookings.filter((booking) => booking.customerId === b).map(toApiBooking))
    if (!a) return json(state.bookings)
    const booking = getBooking(a)
    return booking ? json(booking) : notFound("Booking not found")
  }

  if (resource === "emergency") {
    if (!a) return json(state.emergencies)
    const emergency = state.emergencies.find((e) => e.requestId === a)
    return emergency ? json(emergency) : notFound("Emergency request not found")
  }

  if (resource === "users") {
    if (!a) return json(state.users)
    const user = state.users.find((u) => u.userId === a)
    return user ? json(user) : notFound("User not found")
  }

  if (resource === "customers") {
    if (!a) return json(state.customers)
    if (b === "bookings") return json(state.bookings.filter((booking) => booking.customerId === a))
    const customer = state.customers.find((c) => c.id === a)
    return customer ? json(customer) : notFound("Customer not found")
  }

  if (resource === "notifications") return json(notifications())

  if (resource === "admin") {
    if (a === "stats") return json(adminStats(state))
    if (a === "bookings") return json(publicAdminBookings())
    if (a === "customers") return json(state.customers)
    if (a === "technicians") return json(publicAdminTechnicians())
    if (a === "verifications") return json(state.verificationRequests)
    if (a === "reviews") return json(state.reviews)
    if (a === "emergencies") return json(state.adminEmergencies)
  }

  if (resource === "auth" && a === "session") return json(state.session)

  return notFound()
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const state = getBackendState()
  const path = (await ctx.params).path ?? []
  const [resource, a] = path
  const input = await body<Record<string, unknown>>(req)

  if (resource === "bookings") {
    const booking = bookingFromRequest(input)
    state.bookings.unshift(booking)
    return json(toApiBooking(booking), { status: 201 })
  }

  if (resource === "reviews") {
    const technicianId = String(input.technicianId ?? "")
    const bookingId = String(input.bookingId ?? "")
    const rating = Number(input.rating)
    if (!technicianId || !bookingId || !Number.isFinite(rating)) {
      return badRequest("bookingId, technicianId, and rating are required")
    }

    const review = {
      reviewId: nextId("REV", state.reviews.map((r) => r.reviewId)),
      technicianId,
      bookingId,
      userId: String(input.userId ?? "USER001"),
      rating: Math.min(5, Math.max(1, rating)),
      comment: String(input.comment ?? ""),
      createdAt: new Date().toISOString(),
    }
    state.reviews.unshift(review)

    const booking = getBooking(bookingId)
    if (booking) {
      booking.rating = review.rating
      booking.review = review.comment
      booking.updatedAt = review.createdAt
    }

    return json(review, { status: 201 })
  }

  if (resource === "emergency") {
    const issue = String(input.issue ?? "").trim()
    if (!issue) return badRequest("issue is required")

    const now = new Date().toISOString()
    const emergency: EmergencyRecord = {
      requestId: nextId("EMG", state.emergencies.map((e) => e.requestId)),
      userId: String(input.userId ?? "USER001"),
      issue,
      status: "searching",
      createdAt: now,
      updatedAt: now,
    }
    state.emergencies.unshift(emergency)
    return json({ requestId: emergency.requestId }, { status: 201 })
  }

  if (resource === "auth" && a === "register") {
    const role = String(input.role ?? "customer")
    const name = String(input.name ?? input.email ?? "RapidFix User")
    const userId = role === "technician" ? nextId("TECH", state.technicians.map((t) => t.technicianId)) : nextId("USER", state.users.map((u) => u.userId))
    const phone = String(input.phone ?? "")
    const email = String(input.email ?? `${userId.toLowerCase()}@example.com`)

    state.users.push({ userId, name, phone, role })
    if (role === "customer") {
      state.customers.push({
        id: userId,
        name,
        phone,
        email,
        addresses: [],
        totalBookings: 0,
        averageRating: 0,
        createdAt: new Date().toISOString(),
      })
    }
    if (role === "technician") {
      state.technicians.push({
        technicianId: userId,
        name,
        skill: String(input.skill ?? "Electrician"),
        rating: 0,
        available: false,
        phone,
      })
    }

    return json({ userId, sessionToken: `demo-${userId}` }, { status: 201 })
  }

  if (resource === "auth" && a === "login") {
    const email = String(input.email ?? "admin@rapidfix.local")
    const role = email.includes("admin") ? "admin" : email.includes("tech") ? "technician" : "customer"
    const userId = role === "admin" ? "ADMIN001" : role === "technician" ? "TECH001" : "USER001"
    state.session = { userId, role, email }
    return json({ userId, role, sessionToken: `demo-${userId}` })
  }

  if (resource === "auth" && ["logout", "verify-email", "resend-verification-email"].includes(a ?? "")) {
    if (a === "logout") state.session = null
    return json({ ok: true })
  }

  return notFound()
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const state = getBackendState()
  const path = (await ctx.params).path ?? []
  const [resource, a, b] = path
  const input = await body<Record<string, unknown>>(req)
  const now = new Date().toISOString()

  if (resource === "bookings") {
    const bookingId = String(input.bookingId ?? b ?? "")
    const booking = getBooking(bookingId)
    if (!booking) return notFound("Booking not found")

    if (a === "accept") booking.status = "assigned"
    if (a === "cancel") booking.status = "cancelled"
    if (a === "status") {
      const status = String(input.status ?? "")
      if (!["pending", "assigned", "in_progress", "completed", "cancelled"].includes(status)) {
        return badRequest("Invalid booking status")
      }
      booking.status = status as Booking["status"]
    }
    booking.updatedAt = now
    return json(toApiBooking(booking))
  }

  if (resource === "emergency") {
    const requestId = String(input.requestId ?? b ?? "")
    const emergency = state.emergencies.find((e) => e.requestId === requestId)
    if (!emergency) return notFound("Emergency request not found")

    if (a === "accept") {
      emergency.status = "assigned"
      emergency.technicianId = String(input.technicianId ?? "")
    }
    if (a === "cancel") emergency.status = "cancelled"
    emergency.updatedAt = now
    return json(emergency)
  }

  if (resource === "customers" && a) {
    const index = state.customers.findIndex((c) => c.id === a)
    if (index === -1) return notFound("Customer not found")
    state.customers[index] = { ...state.customers[index], ...(input as Partial<CustomerProfile>) }
    return json(state.customers[index])
  }

  if (resource === "technicians" && a === "profile" && b) {
    const index = state.technicianProfiles.findIndex((p) => p.id === b)
    if (index === -1) return notFound("Technician profile not found")
    state.technicianProfiles[index] = { ...state.technicianProfiles[index], ...(input as Partial<TechnicianProfile>) }
    return json(state.technicianProfiles[index])
  }

  if (resource === "admin" && a === "verifications" && b) {
    const request = state.verificationRequests.find((r) => r.id === b)
    if (!request) return notFound("Verification request not found")
    state.verificationRequests = state.verificationRequests.filter((r) => r.id !== b)
    return json({ ...request, approved: Boolean(input.approved) })
  }

  if (resource === "admin" && a === "bookings" && b) {
    const booking = getBooking(b)
    if (!booking) return notFound("Booking not found")
    if (typeof input.technicianId === "string") booking.technicianId = input.technicianId
    booking.status = "assigned"
    booking.updatedAt = now
    return json(toApiBooking(booking))
  }

  return notFound()
}

export const PATCH = PUT
