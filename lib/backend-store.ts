import {
  ADMIN_BOOKINGS,
  ADMIN_CUSTOMERS,
  ADMIN_TECHNICIANS,
  EMERGENCY_REQUESTS,
  VERIFICATION_REQUESTS,
  type EmergencyRequest,
  type VerificationRequest,
} from "@/lib/admin-data"
import { CUSTOMER_BOOKINGS, NOTIFICATIONS, SAVED_ADDRESSES } from "@/lib/customer-data"
import type { ApiBooking, ApiReview, ApiTechnician, ApiUser } from "@/lib/api"
import type {
  AdminStats,
  Booking,
  CustomerProfile,
  TechnicianProfile,
} from "@/lib/services"

export type EmergencyRecord = {
  requestId: string
  userId: string
  issue: string
  status: "searching" | "assigned" | "cancelled" | "resolved"
  technicianId?: string
  createdAt: string
  updatedAt: string
}

export type SessionRecord = {
  userId: string
  role: string
  email: string
}

type BackendState = {
  users: ApiUser[]
  technicians: ApiTechnician[]
  technicianProfiles: TechnicianProfile[]
  customers: CustomerProfile[]
  bookings: Booking[]
  reviews: ApiReview[]
  emergencies: EmergencyRecord[]
  verificationRequests: VerificationRequest[]
  adminEmergencies: EmergencyRequest[]
  session: SessionRecord | null
}

const g = globalThis as typeof globalThis & {
  __rapidfixBackendState?: BackendState
}

function nowIso() {
  return new Date().toISOString()
}

function toApiStatus(status: Booking["status"]) {
  return status === "in_progress" ? "in_progress" : status
}

function seedTechnicians(): ApiTechnician[] {
  return ADMIN_TECHNICIANS.map((t) => ({
    technicianId: t.id,
    name: t.name,
    skill: t.skill === "AC Technician" ? "AC Repair" : t.skill,
    rating: t.rating,
    available: t.status === "Verified",
    phone:
      t.id === "TECH001"
        ? "+91 98290 11234"
        : t.id === "TECH002"
          ? "+91 91450 66778"
          : t.id === "TECH003"
            ? "+91 99100 33445"
            : t.id === "TECH004"
              ? "+91 90000 77321"
              : "+91 98765 43210",
  }))
}

function seedTechnicianProfiles(technicians: ApiTechnician[]): TechnicianProfile[] {
  return technicians.map((t, i) => ({
    id: t.technicianId,
    name: t.name,
    phone: t.phone,
    email: `${t.name.toLowerCase().replace(/\s+/g, ".")}@rapidfix.local`,
    skills: [t.skill, "Emergency Support", "Home Service"],
    city: ADMIN_TECHNICIANS[i]?.city ?? "Jaipur",
    rating: t.rating,
    completedBookings: ADMIN_TECHNICIANS[i]?.jobs ?? 0,
    verificationStatus: t.available ? "verified" : "pending",
    documents: {
      idProof: "aadhaar-card.pdf",
      certifications: ["skill-certificate.pdf", "experience-letter.pdf"],
    },
  }))
}

function seedCustomers(): CustomerProfile[] {
  return ADMIN_CUSTOMERS.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: `${c.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    addresses: SAVED_ADDRESSES.map((a) => ({
      id: a.id,
      title: a.label,
      address: a.line,
      city: a.city,
      postalCode: a.pincode,
      isDefault: a.isDefault,
    })),
    totalBookings: c.bookings,
    averageRating: 4.7,
    createdAt: new Date("2025-01-15T10:00:00.000Z").toISOString(),
  }))
}

function seedBookings(): Booking[] {
  const adminBookings = ADMIN_BOOKINGS.map((b, i): Booking => ({
    id: b.id,
    customerId: ADMIN_CUSTOMERS[i % ADMIN_CUSTOMERS.length]?.id ?? "USER001",
    technicianId: ADMIN_TECHNICIANS[i % ADMIN_TECHNICIANS.length]?.id ?? "TECH001",
    service: b.service,
    description: `${b.service} service request`,
    status:
      b.status === "Completed"
        ? "completed"
        : b.status === "Cancelled"
          ? "cancelled"
          : "in_progress",
    scheduledDate: b.date,
    location: ADMIN_CUSTOMERS[i % ADMIN_CUSTOMERS.length]?.city ?? "Jaipur",
    amount: b.amount,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }))

  const customerBookings = CUSTOMER_BOOKINGS.map((b, i): Booking => ({
    id: b.id,
    customerId: "USER001",
    technicianId: ADMIN_TECHNICIANS[(i + 1) % ADMIN_TECHNICIANS.length]?.id ?? "TECH001",
    service: b.service,
    description: `${b.service} booking with ${b.technician}`,
    status:
      b.status === "Completed"
        ? "completed"
        : b.status === "Cancelled"
          ? "cancelled"
          : "pending",
    scheduledDate: b.date,
    location: SAVED_ADDRESSES[0]?.city ?? "Jaipur",
    amount: b.amount,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }))

  return [...adminBookings, ...customerBookings]
}

function seedReviews(): ApiReview[] {
  return [
    {
      reviewId: "REV001",
      technicianId: "TECH001",
      userId: "USER001",
      rating: 5,
      comment: "Fast response, clean work, and fair pricing.",
      createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    },
    {
      reviewId: "REV002",
      technicianId: "TECH001",
      userId: "USER003",
      rating: 5,
      comment: "Solved the wiring issue quickly and explained the fix clearly.",
      createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    },
    {
      reviewId: "REV003",
      technicianId: "TECH002",
      userId: "USER004",
      rating: 4,
      comment: "Good plumbing repair and arrived within the promised slot.",
      createdAt: new Date(Date.now() - 15 * 86_400_000).toISOString(),
    },
  ]
}

function createInitialState(): BackendState {
  const technicians = seedTechnicians()
  const customers = seedCustomers()

  return {
    users: [
      ...customers.map((c) => ({
        userId: c.id,
        name: c.name,
        phone: c.phone,
        role: "customer",
      })),
      ...technicians.map((t) => ({
        userId: t.technicianId,
        name: t.name,
        phone: t.phone,
        role: "technician",
      })),
      { userId: "ADMIN001", name: "RapidFix Admin", phone: "+91 90000 00000", role: "admin" },
    ],
    technicians,
    technicianProfiles: seedTechnicianProfiles(technicians),
    customers,
    bookings: seedBookings(),
    reviews: seedReviews(),
    emergencies: [],
    verificationRequests: [...VERIFICATION_REQUESTS],
    adminEmergencies: [...EMERGENCY_REQUESTS],
    session: null,
  }
}

export function getBackendState() {
  g.__rapidfixBackendState ??= createInitialState()
  return g.__rapidfixBackendState
}

export function toApiBooking(booking: Booking): ApiBooking {
  return {
    bookingId: booking.id,
    userId: booking.customerId,
    technicianId: booking.technicianId ?? "",
    status: toApiStatus(booking.status),
    issue: booking.description,
    serviceType: booking.service,
    createdAt: booking.createdAt,
  }
}

export function adminStats(state = getBackendState()): AdminStats {
  const completed = state.bookings.filter((b) => b.status === "completed")
  return {
    totalBookings: state.bookings.length,
    totalCustomers: state.customers.length,
    totalTechnicians: state.technicians.length,
    totalRevenue: completed.reduce((sum, b) => sum + b.amount, 0),
    pendingVerifications: state.verificationRequests.length,
    completedThisMonth: completed.length,
    activeBookings: state.bookings.filter((b) => ["pending", "assigned", "in_progress"].includes(b.status)).length,
  }
}

export function notifications() {
  return NOTIFICATIONS
}
