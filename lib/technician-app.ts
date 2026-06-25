// Mock data + types for the RapidFix Technician App.
// Real API powers the technician profile, reviews and rating (see lib/api.ts).
// Everything below is realistic local mock data used until matching backend
// endpoints exist (jobs feed, earnings ledger, verification, settings).

export const CURRENT_TECHNICIAN_ID = "TECH001"

export type JobStatus = "upcoming" | "in-progress" | "completed" | "cancelled"

export type WorkflowStage =
  | "received"
  | "accepted"
  | "on_the_way"
  | "reached"
  | "started"
  | "completed"

export const WORKFLOW_STAGES: { key: WorkflowStage; label: string }[] = [
  { key: "received", label: "Request Received" },
  { key: "accepted", label: "Accepted" },
  { key: "on_the_way", label: "On The Way" },
  { key: "reached", label: "Reached Location" },
  { key: "started", label: "Work Started" },
  { key: "completed", label: "Completed" },
]

export interface Job {
  id: string
  customerName: string
  phone: string
  address: string
  area: string
  city: string
  issue: string
  category: string
  status: JobStatus
  stage: WorkflowStage
  scheduledLabel: string
  amount: number
  distanceKm: number
  emergency?: boolean
}

export const jobs: Job[] = [
  {
    id: "JOB1042",
    customerName: "Ananya Iyer",
    phone: "+91 98201 44521",
    address: "B-204, Sunrise Residency, Andheri West",
    area: "Andheri West",
    city: "Mumbai",
    issue: "Main switchboard sparking and tripping repeatedly. Needs urgent inspection.",
    category: "Electrician",
    status: "in-progress",
    stage: "on_the_way",
    scheduledLabel: "Today, 11:30 AM",
    amount: 850,
    distanceKm: 2.3,
    emergency: true,
  },
  {
    id: "JOB1041",
    customerName: "Rohit Deshmukh",
    phone: "+91 99300 11882",
    address: "Flat 7, Shivaji Park, Dadar",
    area: "Dadar",
    city: "Mumbai",
    issue: "Ceiling fan in living room not working, makes humming noise.",
    category: "Electrician",
    status: "upcoming",
    stage: "accepted",
    scheduledLabel: "Today, 3:00 PM",
    amount: 450,
    distanceKm: 4.1,
  },
  {
    id: "JOB1040",
    customerName: "Sneha Kulkarni",
    phone: "+91 98191 77334",
    address: "12, Green Acres, Powai",
    area: "Powai",
    city: "Mumbai",
    issue: "Install 2 new LED tube lights and replace old wiring in kitchen.",
    category: "Electrician",
    status: "upcoming",
    stage: "accepted",
    scheduledLabel: "Tomorrow, 10:00 AM",
    amount: 1200,
    distanceKm: 6.8,
  },
  {
    id: "JOB1039",
    customerName: "Imran Shaikh",
    phone: "+91 90040 56120",
    address: "A-9, Crystal Tower, Bandra East",
    area: "Bandra East",
    city: "Mumbai",
    issue: "Geyser not heating water. Replaced thermostat.",
    category: "Electrician",
    status: "completed",
    stage: "completed",
    scheduledLabel: "Yesterday, 5:30 PM",
    amount: 650,
    distanceKm: 3.2,
  },
  {
    id: "JOB1038",
    customerName: "Priya Nair",
    phone: "+91 98335 22014",
    address: "303, Lake View, Vikhroli",
    area: "Vikhroli",
    city: "Mumbai",
    issue: "Inverter battery not charging. Diagnosed and fixed loose terminal.",
    category: "Electrician",
    status: "completed",
    stage: "completed",
    scheduledLabel: "22 Jun, 2:00 PM",
    amount: 500,
    distanceKm: 5.0,
  },
  {
    id: "JOB1037",
    customerName: "Vikas Malhotra",
    phone: "+91 99876 33210",
    address: "Bungalow 4, Hiranandani, Powai",
    area: "Powai",
    city: "Mumbai",
    issue: "Full house wiring check for new flat.",
    category: "Electrician",
    status: "completed",
    stage: "completed",
    scheduledLabel: "21 Jun, 11:00 AM",
    amount: 2400,
    distanceKm: 7.1,
  },
  {
    id: "JOB1036",
    customerName: "Fatima Khan",
    phone: "+91 98765 09812",
    address: "21, Marine Lines",
    area: "Marine Lines",
    city: "Mumbai",
    issue: "AC not cooling — customer cancelled, out of service area.",
    category: "Electrician",
    status: "cancelled",
    stage: "received",
    scheduledLabel: "20 Jun, 4:00 PM",
    amount: 0,
    distanceKm: 12.4,
  },
]

export interface DashboardStats {
  earningsToday: number
  jobsToday: number
  responseRate: number
  activeEmergencies: number
}

export const dashboardStats: DashboardStats = {
  earningsToday: 2150,
  jobsToday: 4,
  responseRate: 96,
  activeEmergencies: 1,
}

export interface EarningsData {
  today: number
  week: number
  month: number
  jobsToday: number
  jobsWeek: number
  jobsMonth: number
  weekly: { day: string; amount: number }[]
  withdrawals: {
    id: string
    date: string
    amount: number
    method: string
    status: "Completed" | "Processing"
  }[]
}

export const earnings: EarningsData = {
  today: 2150,
  week: 11400,
  month: 48600,
  jobsToday: 4,
  jobsWeek: 23,
  jobsMonth: 98,
  weekly: [
    { day: "Mon", amount: 1800 },
    { day: "Tue", amount: 2400 },
    { day: "Wed", amount: 1200 },
    { day: "Thu", amount: 3100 },
    { day: "Fri", amount: 2150 },
    { day: "Sat", amount: 3650 },
    { day: "Sun", amount: 1900 },
  ],
  withdrawals: [
    { id: "WD2210", date: "20 Jun 2026", amount: 9800, method: "HDFC ••4521", status: "Completed" },
    { id: "WD2188", date: "13 Jun 2026", amount: 12400, method: "HDFC ••4521", status: "Completed" },
    { id: "WD2154", date: "06 Jun 2026", amount: 10250, method: "HDFC ••4521", status: "Completed" },
    { id: "WD2241", date: "Today", amount: 8600, method: "HDFC ••4521", status: "Processing" },
  ],
}

export interface VerificationItem {
  id: string
  label: string
  description: string
  status: "verified" | "pending" | "not_started"
}

export const verificationItems: VerificationItem[] = [
  {
    id: "aadhaar",
    label: "Aadhaar Verification",
    description: "Identity confirmed via Aadhaar e-KYC",
    status: "verified",
  },
  {
    id: "address",
    label: "Address Proof",
    description: "Electricity bill verified for current address",
    status: "verified",
  },
  {
    id: "certificate",
    label: "Skill Certificate",
    description: "ITI Electrician certificate uploaded",
    status: "pending",
  },
  {
    id: "shop",
    label: "Shop Verification",
    description: "Add your shop/workspace details and photo",
    status: "not_started",
  },
]

export interface TechnicianProfileExtras {
  experienceYears: number
  serviceAreas: string[]
  languages: string[]
}

export const profileExtras: TechnicianProfileExtras = {
  experienceYears: 8,
  serviceAreas: ["Andheri", "Bandra", "Powai", "Dadar", "Vikhroli"],
  languages: ["Hindi", "English", "Marathi"],
}

export interface EmergencyAlert {
  id: string
  customerName: string
  issue: string
  category: string
  distanceKm: number
  estimatedEarning: number
  address: string
}

export const sampleEmergencyAlert: EmergencyAlert = {
  id: "EMG5521",
  customerName: "Meena Patel",
  issue: "Burning smell from main electrical panel, sparks visible",
  category: "Electrician",
  distanceKm: 0.8,
  estimatedEarning: 1100,
  address: "402, Orchid Heights, Andheri West, Mumbai",
}

export function inr(amount: number) {
  return "₹" + amount.toLocaleString("en-IN")
}
