import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProperties from '@/components/sections/FeaturedProperties'
import {
  WhyUsSection,
  CitiesSection,
  StatsSection,
  TestimonialsSection,
  BlogSection,
  CTASection,
} from '@/components/sections/HomeSections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PLOTIX Reality — Premium Properties Across India',
  description:
    'Discover your perfect property on PLOTIX Reality. Browse thousands of premium residential and commercial listings across India\'s finest cities.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
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
