import { Header } from '@/components/header'
import { HeroSection } from '@/components/sections/hero'
import { ServicesSection } from '@/components/sections/services'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { AstrologersSection } from '@/components/sections/astrologers'
import { BlogSection } from '@/components/sections/blog'
import { CTASection } from '@/components/sections/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
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
