"use client"

import { AdminHeader } from "@/components/admin/admin-ui"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ADMIN_CUSTOMERS, type AdminCustomer } from "@/lib/admin-data"

const columns: Column<AdminCustomer>[] = [
  { key: "id", header: "ID" },
  {
    key: "name",
    header: "Customer",
    render: (r) => <span className="font-medium text-foreground">{r.name}</span>,
  },
  { key: "city", header: "City" },
  { key: "phone", header: "Phone" },
  { key: "bookings", header: "Bookings" },
  { key: "joined", header: "Joined" },
]

export default function AdminCustomersPage() {
  return (
    <>
      <AdminHeader title="Customers" subtitle={`${ADMIN_CUSTOMERS.length} registered customers`} />
      <div className="px-5 py-6 md:px-8">
        <DataTable
          rows={ADMIN_CUSTOMERS as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchKeys={["name", "city", "phone", "id"] as (keyof Record<string, unknown>)[]}
          searchPlaceholder="Search by name, city, or phone..."
        />
      </div>
    </>
  )
}
