import { TechnicianProfile } from "@/components/services/technician-profile"

export default async function TechnicianPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <TechnicianProfile technicianId={id} />
    </main>
  )
}
