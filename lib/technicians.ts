export type Review = {
  name: string
  rating: number
  date: string
  text: string
}

export type Technician = {
  id: string
  name: string
  photo: string
  category: string
  icon: string
  rating: number
  reviews: number
  jobs: number
  distance: number
  startingPrice: number
  available: boolean
  emergency: boolean
  topRated: boolean
  experience: string
  about: string
  skills: string[]
  certifications: string[]
  reviewList: Review[]
  phone?: string
}

export const categories = [
  "All",
  "Electrician",
  "Plumber",
  "Mechanic",
  "AC Repair",
  "Carpenter",
  "Mobile Repair",
  "Appliance",
  "Agricultural",
]

const sampleReviews: Review[] = [
  {
    name: "Ramesh K.",
    rating: 5,
    date: "2 days ago",
    text: "Arrived within 20 minutes and fixed the wiring issue quickly. Very professional and polite.",
  },
  {
    name: "Sunita D.",
    rating: 5,
    date: "1 week ago",
    text: "Fair pricing and excellent work. Explained everything clearly before starting. Highly recommend.",
  },
  {
    name: "Mahesh P.",
    rating: 4,
    date: "3 weeks ago",
    text: "Good service overall. Came a little late but the repair was solid and well done.",
  },
]

export const technicians: Technician[] = [
  {
    id: "rahul-verma",
    name: "Rahul Verma",
    photo: "/technician-avatar.png",
    category: "Electrician",
    icon: "Zap",
    rating: 4.9,
    reviews: 342,
    jobs: 1280,
    distance: 1.4,
    startingPrice: 299,
    available: true,
    emergency: true,
    topRated: true,
    experience: "8 years",
    about:
      "Certified electrician specializing in residential and commercial wiring, switchboard installation, and emergency electrical repairs. Committed to safe, reliable work with transparent pricing.",
    skills: ["Wiring", "Switchboard", "Motor Repair", "Inverter Setup", "Fault Finding"],
    certifications: ["ITI Electrician Certified", "Govt. Licensed Wireman", "Safety Training Level 2"],
    reviewList: sampleReviews,
  },
  {
    id: "anita-sharma",
    name: "Anita Sharma",
    photo: "/technician-avatar-2.png",
    category: "Electrician",
    icon: "Zap",
    rating: 4.8,
    reviews: 215,
    jobs: 870,
    distance: 2.1,
    startingPrice: 349,
    available: true,
    emergency: true,
    topRated: true,
    experience: "6 years",
    about:
      "Experienced electrician with a focus on home appliance wiring and smart home installations. Known for punctuality and clean, tidy work.",
    skills: ["Appliance Wiring", "Smart Home", "Lighting", "Switchboard", "Safety Audit"],
    certifications: ["ITI Electrician Certified", "Smart Home Installer"],
    reviewList: sampleReviews,
  },
  {
    id: "suresh-patel",
    name: "Suresh Patel",
    photo: "/tech-plumber.png",
    category: "Plumber",
    icon: "Droplet",
    rating: 4.7,
    reviews: 189,
    jobs: 640,
    distance: 0.9,
    startingPrice: 249,
    available: true,
    emergency: false,
    topRated: true,
    experience: "10 years",
    about:
      "Master plumber handling leak repairs, pipe fitting, bathroom installations, and water tank setups. Fast, dependable service for homes and farms.",
    skills: ["Leak Repair", "Pipe Fitting", "Tank Setup", "Bathroom Fitting", "Drainage"],
    certifications: ["Certified Plumber", "Water Systems Specialist"],
    reviewList: sampleReviews,
  },
  {
    id: "vijay-kumar",
    name: "Vijay Kumar",
    photo: "/tech-mechanic.png",
    category: "Mechanic",
    icon: "Wrench",
    rating: 4.6,
    reviews: 276,
    jobs: 980,
    distance: 3.2,
    startingPrice: 399,
    available: false,
    emergency: true,
    topRated: false,
    experience: "12 years",
    about:
      "Two-wheeler and tractor mechanic with deep experience in engine repair, servicing, and roadside breakdown support across rural areas.",
    skills: ["Engine Repair", "Servicing", "Brake Work", "Tractor Repair", "Roadside Help"],
    certifications: ["Automobile Mechanic Diploma", "Tractor Service Certified"],
    reviewList: sampleReviews,
  },
  {
    id: "deepa-nair",
    name: "Deepa Nair",
    photo: "/tech-ac.png",
    category: "AC Repair",
    icon: "Wind",
    rating: 4.9,
    reviews: 158,
    jobs: 520,
    distance: 1.8,
    startingPrice: 499,
    available: true,
    emergency: false,
    topRated: true,
    experience: "7 years",
    about:
      "AC and refrigeration specialist offering installation, gas refilling, deep cleaning, and repair for all major brands. Reliable seasonal maintenance plans available.",
    skills: ["AC Install", "Gas Refill", "Deep Cleaning", "Compressor Repair", "Servicing"],
    certifications: ["HVAC Certified", "Refrigeration Technician License"],
    reviewList: sampleReviews,
  },
  {
    id: "mohan-lal",
    name: "Mohan Lal",
    photo: "/tech-carpenter.png",
    category: "Carpenter",
    icon: "Hammer",
    rating: 4.5,
    reviews: 134,
    jobs: 410,
    distance: 4.5,
    startingPrice: 349,
    available: true,
    emergency: false,
    topRated: false,
    experience: "15 years",
    about:
      "Skilled carpenter crafting custom furniture, doors, and cabinets. Also handles repairs, polishing, and modular fittings with great attention to detail.",
    skills: ["Furniture", "Door Fitting", "Cabinets", "Polishing", "Repairs"],
    certifications: ["Master Carpenter", "Woodwork Specialist"],
    reviewList: sampleReviews,
  },
]

export function getTechnician(id: string) {
  return technicians.find((t) => t.id === id)
}
