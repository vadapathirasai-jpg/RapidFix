export interface SavedAddress {
  id: string
  label: string
  line: string
  city: string
  pincode: string
  isDefault: boolean
}

export const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "ADDR1",
    label: "Home",
    line: "B-204, Sunrise Apartments, Vaishali Nagar",
    city: "Jaipur, Rajasthan",
    pincode: "302021",
    isDefault: true,
  },
  {
    id: "ADDR2",
    label: "Office",
    line: "5th Floor, Tech Park, Sitapura Industrial Area",
    city: "Jaipur, Rajasthan",
    pincode: "302022",
    isDefault: false,
  },
]

export interface CustomerBooking {
  id: string
  service: string
  technician: string
  date: string
  amount: number
  status: "Completed" | "Upcoming" | "Cancelled"
  reviewed: boolean
}

export const CUSTOMER_BOOKINGS: CustomerBooking[] = [
  { id: "BK-9012", service: "Electrician", technician: "Ravi Kumar", date: "Today, 4:30 PM", amount: 449, status: "Upcoming", reviewed: false },
  { id: "BK-8890", service: "Plumber", technician: "Sunil Patil", date: "20 Jun 2026", amount: 299, status: "Completed", reviewed: false },
  { id: "BK-8721", service: "AC Repair", technician: "Kavita Reddy", date: "12 Jun 2026", amount: 899, status: "Completed", reviewed: true },
  { id: "BK-8650", service: "Carpenter", technician: "Imran Khan", date: "5 Jun 2026", amount: 549, status: "Cancelled", reviewed: false },
]

export type NotificationType = "booking" | "promo" | "system" | "payment"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  time: string
  read: boolean
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "N1",
    type: "booking",
    title: "Technician on the way",
    body: "Ravi Kumar will reach your location in approximately 12 minutes.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "N2",
    type: "payment",
    title: "Payment successful",
    body: "₹299 paid to Sunil Patil for your plumbing service.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "N3",
    type: "promo",
    title: "Monsoon offer: 20% off",
    body: "Get 20% off on all AC servicing bookings this week. Use code RAIN20.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "N4",
    type: "booking",
    title: "Service completed",
    body: "Your AC repair with Kavita Reddy is complete. Rate your experience.",
    time: "12 Jun",
    read: true,
  },
  {
    id: "N5",
    type: "system",
    title: "Profile verified",
    body: "Your phone number has been successfully verified.",
    time: "10 Jun",
    read: true,
  },
]
