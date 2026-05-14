import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import FeaturedProperties from "@/components/sections/FeaturedProperties"
import WhyUsSection from "@/components/sections/WhyUsSection"
import CitiesSection from "@/components/sections/CitiesSection"
import StatsSection from "@/components/sections/StatsSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import BlogSection from "@/components/sections/BlogSection"
import CTASection from "@/components/sections/CTASection"
import { auth } from "@/lib/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PLOTIX Reality — Premium Properties Across India",
  description: "Discover your perfect property. Browse thousands of premium residential and commercial listings across India's finest cities.",
}

export default async function HomePage() {
  const session = await auth()
  return (
    <>
      <Navbar user={session?.user as any} />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <WhyUsSection />
        <CitiesSection />
        <StatsSection />
        <TestimonialsSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
