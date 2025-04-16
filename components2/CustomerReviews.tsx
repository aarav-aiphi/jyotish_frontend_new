'use client'
import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import * as motion from "framer-motion/client"

interface Review {
  id: number
  name: string
  role: string
  comment: string
  avatar: string
  sanskritTitle?: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Spiritual Seeker",
    sanskritTitle: "आत्म ज्ञानी",
    comment: "The astrological insights provided were deeply enlightening and helped me understand my spiritual path better.",
    avatar: "/testimonials/indian-spiritual-1.jpg" // Man with tilak
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Yoga Practitioner",
    sanskritTitle: "योग साधक",
    comment: "The cosmic wisdom shared through these consultations has transformed my understanding of dharma and karma.",
    avatar: "/testimonials/indian-spiritual-2.jpg" // Woman in traditional attire
  },
  {
    id: 3,
    name: "Amit Verma",
    role: "Meditation Guide",
    sanskritTitle: "ध्यान गुरु",
    comment: "The accuracy of the predictions and depth of vedic knowledge shared here by the astrologers is truly remarkable.",
    avatar: "/testimonials/indian-spiritual-3.jpg" // Spiritual teacher
  },
  {
    id: 4,
    name: "Lakshmi Devi",
    role: "Ayurveda Practitioner",
    sanskritTitle: "आयुर्वेद विशेषज्ञ",
    comment: "Combining astrology with ayurvedic wisdom has helped my clients immensely. This platform is a blessing.",
    avatar: "/testimonials/indian-spiritual-4.jpg" // Traditional healer
  }
]

export function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0)

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const previousReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-sacred-sandal via-white to-sacred-saffron/10 relative overflow-hidden">
      {/* Static Sacred Mandala Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.png')] bg-repeat opacity-10" />
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-sacred-gold/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sacred-vermilion/10 rounded-full blur-2xl animate-float animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Enhanced Sanskrit Title with Decorative Circle */}
          <div className="relative inline-block mb-6">
            {/* Inner static circle */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-full px-8 py-2 border-2 border-sacred-gold/20
                          shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]
                          transition-all duration-500">
              <motion.span 
                className="inline-block text-lg md:text-xl bg-gradient-to-r from-sacred-copper via-sacred-gold to-sacred-vermilion
                           bg-clip-text text-transparent font-semibold tracking-wide"
                whileHover={{ scale: 1.05 }}
              >
                <span className="animate-glow inline-block">🕉️</span>
                <span className="mx-2">भक्तों की प्रशंसा</span>
                <span className="animate-glow inline-block">🕉️</span>
              </motion.span>
              
              {/* Decorative dots */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sacred-gold/60" />
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sacred-gold/60" />
            </div>
          </div>
          
          <h2 className="text-5xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper animate-sacred-shimmer bg-[length:200%_auto]">
              Divine Testimonials
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper rounded-full"></div>
          </h2>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentReview}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 bg-gradient-to-b from-sacred-sandal/50 to-white rounded-2xl shadow-lg border border-sacred-gold/20"
          >
            {/* Enhanced Decorative Corner Ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-sacred-gold/30 rounded-tl-2xl" />
              <div className="absolute top-2 left-2 w-2 h-2 bg-sacred-gold/40 rounded-full" />
            </div>
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-sacred-gold/30 rounded-tr-2xl" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-sacred-gold/40 rounded-full" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper rounded-full opacity-50 group-hover:opacity-100 transition duration-500 blur-md"></div>
                <div className="relative">
                  <Image
                    src={reviews[currentReview].avatar}
                    alt={reviews[currentReview].name}
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-sacred-gold/20 object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sacred-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-sacred-vermilion">🕉️</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="font-bold text-xl text-sacred-vermilion mb-1">{reviews[currentReview].name}</h3>
                <p className="text-sacred-copper mb-1">{reviews[currentReview].role}</p>
                {reviews[currentReview].sanskritTitle && (
                  <p className="text-sacred-gold text-sm font-sanskrit">{reviews[currentReview].sanskritTitle}</p>
                )}
              </div>
            </div>
            
            <div className="relative">
              <span className="absolute -left-2 -top-2 text-4xl text-sacred-gold/20">"</span>
              <p className="text-sacred-copper/80 italic text-lg text-center px-8">
                {reviews[currentReview].comment}
              </p>
              <span className="absolute -right-2 -bottom-2 text-4xl text-sacred-gold/20">"</span>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousReview}
                className="p-3 rounded-full bg-gradient-to-r from-sacred-vermilion to-sacred-gold text-white hover:shadow-lg hover:shadow-sacred-gold/20 transition-all duration-300"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextReview}
                className="p-3 rounded-full bg-gradient-to-r from-sacred-gold to-sacred-vermilion text-white hover:shadow-lg hover:shadow-sacred-gold/20 transition-all duration-300"
              >
                →
              </motion.button>
            </div>

            {/* Enhanced Bottom Decoration */}
            <div className="absolute -bottom-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-sacred-gold/30 to-transparent"></div>
          </motion.div>
        </div>
        
        {/* Review Progress Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentReview 
                  ? 'bg-sacred-gold w-6' 
                  : 'bg-sacred-gold/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
