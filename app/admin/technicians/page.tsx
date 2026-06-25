"use client"

import { Star } from "lucide-react"
import { AdminHeader, StatusBadge } from "@/components/admin/admin-ui"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ADMIN_TECHNICIANS, type AdminTechnician } from "@/lib/admin-data"

const columns: Column<AdminTechnician>[] = [
  { key: "id", header: "ID" },
  {
    key: "name",
    header: "Technician",
    render: (r) => <span className="font-medium text-foreground">{r.name}</span>,
  },
  { key: "skill", header: "Skill" },
  { key: "city", header: "City" },
  {
    key: "rating",
    header: "Rating",
    render: (r) => (
      <span className="inline-flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        {r.rating}
      </span>
    ),
  },
  { key: "jobs", header: "Jobs", render: (r) => r.jobs.toLocaleString("en-IN") },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
]

export default function AdminTechniciansPage() {
  return (
    <>
      <AdminHeader title="Technicians" subtitle={`${ADMIN_TECHNICIANS.length} registered technicians`} />
      <div className="px-5 py-6 md:px-8">
        <DataTable
          rows={ADMIN_TECHNICIANS as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchKeys={["name", "skill", "city", "id"] as (keyof Record<string, unknown>)[]}
          searchPlaceholder="Search by name, skill, or city..."
        />
      </div>
    </>
  )
}
