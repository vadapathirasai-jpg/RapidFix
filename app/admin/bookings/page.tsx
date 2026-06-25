"use client"

import { AdminHeader, StatusBadge } from "@/components/admin/admin-ui"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ADMIN_BOOKINGS, type AdminBooking } from "@/lib/admin-data"

const columns: Column<AdminBooking>[] = [
  { key: "id", header: "Booking ID", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
  { key: "customer", header: "Customer" },
  { key: "technician", header: "Technician" },
  { key: "service", header: "Service" },
  { key: "amount", header: "Amount", render: (r) => <span className="font-medium text-foreground">₹{r.amount}</span> },
  { key: "date", header: "Date" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
]

export default function AdminBookingsPage() {
  return (
    <>
      <AdminHeader title="Bookings" subtitle="All platform bookings" />
      <div className="px-5 py-6 md:px-8">
        <DataTable
          rows={ADMIN_BOOKINGS as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchKeys={["customer", "technician", "service", "id"] as (keyof Record<string, unknown>)[]}
          searchPlaceholder="Search by customer, technician, or service..."
        />
      </div>
    </>
  )
}
