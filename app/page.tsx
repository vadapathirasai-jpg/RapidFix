import PageTransition from "@/components/PageTransition"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { EmergencyBanner } from "@/components/emergency-banner"
import { ServiceCategories } from "@/components/service-categories"
import { HowItWorks } from "@/components/how-it-works"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <EmergencyBanner />
        <ServiceCategories />
        <HowItWorks />
        <TrustSection />
        <Footer />
      </main>
    </PageTransition>
  )
}
