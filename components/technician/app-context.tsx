"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import useSWR from "swr"
import {
  endpoints,
  fetcher,
  mapTechnician,
  type ApiAverage,
  type ApiTechnician,
} from "@/lib/api"
import { CURRENT_TECHNICIAN_ID } from "@/lib/technician-app"
import type { Technician } from "@/lib/technicians"

interface AppContextValue {
  online: boolean
  setOnline: (v: boolean) => void
  technician: Technician | null
  isLoading: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function TechnicianAppProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true)

  const { data: techData, isLoading } = useSWR<ApiTechnician>(
    endpoints.technician(CURRENT_TECHNICIAN_ID),
    fetcher,
  )
  const { data: avgData } = useSWR<ApiAverage>(
    endpoints.average(CURRENT_TECHNICIAN_ID),
    fetcher,
  )

  const technician = techData ? mapTechnician(techData, avgData) : null

  return (
    <AppContext.Provider value={{ online, setOnline, technician, isLoading }}>
      {children}
    </AppContext.Provider>
  )
}

export function useTechnicianApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error("useTechnicianApp must be used within TechnicianAppProvider")
  }
  return ctx
}
