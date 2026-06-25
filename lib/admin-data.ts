export interface VerificationRequest {
  id: string
  name: string
  skill: string
  experience: string
  city: string
  state: string
  phone: string
  submittedAt: string
  documents: { label: string; type: string }[]
}

export const VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: "VR-2041",
    name: "Suresh Yadav",
    skill: "Electrician",
    experience: "5 Years",
    city: "Jaipur",
    state: "Rajasthan",
    phone: "+91 98290 11234",
    submittedAt: "2 hours ago",
    documents: [
      { label: "Aadhaar Card", type: "PDF" },
      { label: "Address Proof", type: "JPG" },
      { label: "ITI Certificate", type: "PDF" },
      { label: "Diploma Certificate", type: "PDF" },
      { label: "Experience Certificate", type: "PDF" },
    ],
  },
  {
    id: "VR-2040",
    name: "Lakshmi Menon",
    skill: "AC Technician",
    experience: "3 Years",
    city: "Kochi",
    state: "Kerala",
    phone: "+91 97450 88210",
    submittedAt: "5 hours ago",
    documents: [
      { label: "Aadhaar Card", type: "PDF" },
      { label: "Address Proof", type: "PNG" },
      { label: "ITI Certificate", type: "PDF" },
      { label: "Diploma Certificate", type: "PDF" },
      { label: "Experience Certificate", type: "PDF" },
      { label: "Shop License", type: "PDF" },
    ],
  },
  {
    id: "VR-2039",
    name: "Mohammed Irfan",
    skill: "Plumber",
    experience: "10 Years",
    city: "Hyderabad",
    state: "Telangana",
    phone: "+91 90000 77321",
    submittedAt: "Yesterday",
    documents: [
      { label: "Aadhaar Card", type: "PDF" },
      { label: "Address Proof", type: "JPG" },
      { label: "ITI Certificate", type: "PDF" },
      { label: "Diploma Certificate", type: "PDF" },
      { label: "Experience Certificate", type: "PDF" },
    ],
  },
  {
    id: "VR-2038",
    name: "Anjali Deshmukh",
    skill: "Appliance Repair",
    experience: "2 Years",
    city: "Pune",
    state: "Maharashtra",
    phone: "+91 91230 45678",
    submittedAt: "Yesterday",
    documents: [
      { label: "Aadhaar Card", type: "PDF" },
      { label: "Address Proof", type: "JPG" },
      { label: "ITI Certificate", type: "PDF" },
      { label: "Diploma Certificate", type: "PDF" },
      { label: "Experience Certificate", type: "PDF" },
    ],
  },
]

export interface AdminTechnician {
  id: string
  name: string
  skill: string
  city: string
  rating: number
  jobs: number
  status: "Verified" | "Pending" | "Suspended"
}

export const ADMIN_TECHNICIANS: AdminTechnician[] = [
  { id: "TECH001", name: "Ravi Kumar", skill: "Electrician", city: "Jaipur", rating: 4.9, jobs: 1240, status: "Verified" },
  { id: "TECH002", name: "Sunil Patil", skill: "Plumber", city: "Pune", rating: 4.7, jobs: 860, status: "Verified" },
  { id: "TECH003", name: "Deepak Sharma", skill: "Mechanic", city: "Delhi", rating: 4.8, jobs: 1024, status: "Verified" },
  { id: "TECH004", name: "Kavita Reddy", skill: "AC Technician", city: "Hyderabad", rating: 4.6, jobs: 540, status: "Pending" },
  { id: "TECH005", name: "Imran Khan", skill: "Carpenter", city: "Lucknow", rating: 4.5, jobs: 312, status: "Suspended" },
]

export interface AdminCustomer {
  id: string
  name: string
  city: string
  phone: string
  bookings: number
  joined: string
}

export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  { id: "USER001", name: "Aarav Sharma", city: "Jaipur", phone: "+91 98765 43210", bookings: 14, joined: "Jan 2025" },
  { id: "USER002", name: "Meera Iyer", city: "Chennai", phone: "+91 90030 22110", bookings: 8, joined: "Feb 2025" },
  { id: "USER003", name: "Rohit Verma", city: "Delhi", phone: "+91 99100 33445", bookings: 21, joined: "Nov 2024" },
  { id: "USER004", name: "Sneha Joshi", city: "Pune", phone: "+91 91450 66778", bookings: 5, joined: "Mar 2025" },
]

export interface AdminBooking {
  id: string
  customer: string
  technician: string
  service: string
  amount: number
  status: "Completed" | "In Progress" | "Cancelled"
  date: string
}

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: "BK-7781", customer: "Aarav Sharma", technician: "Ravi Kumar", service: "Electrician", amount: 449, status: "Completed", date: "Today" },
  { id: "BK-7780", customer: "Meera Iyer", technician: "Kavita Reddy", service: "AC Repair", amount: 899, status: "In Progress", date: "Today" },
  { id: "BK-7779", customer: "Rohit Verma", technician: "Deepak Sharma", service: "Mechanic", amount: 349, status: "Completed", date: "Yesterday" },
  { id: "BK-7778", customer: "Sneha Joshi", technician: "Sunil Patil", service: "Plumber", amount: 299, status: "Cancelled", date: "Yesterday" },
]

export interface EmergencyRequest {
  id: string
  customer: string
  issue: string
  location: string
  status: "Dispatched" | "Searching" | "Resolved"
  raisedAt: string
}

export const EMERGENCY_REQUESTS: EmergencyRequest[] = [
  { id: "EMG-318", customer: "Priya Nair", issue: "Burning smell from main switchboard", location: "Bandra, Mumbai", status: "Dispatched", raisedAt: "3 min ago" },
  { id: "EMG-317", customer: "Karthik Rao", issue: "Major water pipe burst", location: "Whitefield, Bengaluru", status: "Searching", raisedAt: "12 min ago" },
  { id: "EMG-316", customer: "Fatima Sheikh", issue: "Complete power outage at home", location: "Hazratganj, Lucknow", status: "Resolved", raisedAt: "1 hour ago" },
]
