import { Header } from '@/components/header'
import { ServicesSection } from '@/components/sections/services'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { AstrologersSection } from '@/components/sections/astrologers'
import { BlogSection } from '@/components/sections/blog'
import { CTASection } from '@/components/sections/cta'
import { Footer } from '@/components/footer'
import { Hero } from "@/components2/ui/Hero"
import { FreeServices } from "@/components2/ui/FreeServices"
import { CustomerReviews } from "@/components2/CustomerReviews"
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* <HeroSection /> */}
        <Hero />
        <FreeServices />  
        <CustomerReviews />
        <ServicesSection />
        <TestimonialsSection />
        <AstrologersSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
