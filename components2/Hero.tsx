'use client'
import * as motion from "framer-motion/client"
import { AnimatePresence } from "framer-motion/client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaStar, FaPhoneAlt, FaUserCheck } from 'react-icons/fa'
import Link from 'next/link'

const uniqueFeatures = [
  {
    icon: "🎯",
    title: "Smart Match™",
    desc: "AI-powered astrologer matching"
  },
  {
    icon: "🎥",
    title: "Live Video Call",
    desc: "Face-to-face consultations"
  },
  {
    icon: "⚡",
    title: "Instant Connect",
    desc: "Chat within 30 seconds"
  },
  {
    icon: "💎",
    title: "Premium Free",
    desc: "First 10 mins complimentary"
  },
];

const floatingMessages = [
  "First 10 Minutes Absolutely Free! 🎉",
  "AI-Matched Expert Astrologers ⭐",
  "Video Consultation Available 🎥",
  "Vedic + Modern Astrology Blend 🕉️",
  "100% Satisfaction Guaranteed ✨",
  "Lowest Price Promise - ₹10/min 💰"
]

const catchyQuestions = [
  "🌠 Destiny Calling: Ready to Peek into Your Future?",
  "💝 Looking for True Love? Know When They'll Arrive!",
  "💫 Career Success Loading... When Will It Peak?",
  "💎 Big Fortune Coming? Let's Find Out When!",
  "💑 Marriage on Your Mind? Perfect Timing Revealed!",
  "🏆 Success is Written in Your Stars - Discover When!",
  "⭐ Life-Changing Moments Ahead - Are You Ready?",
  "🌟 Your Dreams Are Valid - Let's Time Them Right!"
];

const testimonials = [
  { text: "Found my soulmate!", rating: 5 },
  { text: "Got my dream job!", rating: 5 },
  { text: "Life-changing advice", rating: 5 }
];

export function Hero() {
  const [activeMessage, setActiveMessage] = useState(0)
  const [expertCount, setExpertCount] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % floatingMessages.length)
    }, 3000)

    // Animate expert counter
    const countInterval = setInterval(() => {
      setExpertCount(prev => {
        if (prev < 50) return prev + 1
        clearInterval(countInterval)
        return prev
      })
    }, 50)

    const questionInterval = setInterval(() => {
      setActiveQuestion((prev) => (prev + 1) % catchyQuestions.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval)
      clearInterval(countInterval)
      clearInterval(questionInterval);
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-saffron-100 via-white to-sacred-sandal/10">
      {/* Updated Premium Floating Badge with new positioning */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-4 z-50 hidden lg:block" // Changed to fixed and added responsive hide
      >
        <div className="bg-gradient-to-r from-sacred-gold to-sacred-copper p-[1px] rounded-full">
          <div className="bg-white px-4 py-1 rounded-full">
            <span className="text-sm font-medium bg-gradient-to-r from-sacred-gold to-sacred-copper bg-clip-text text-transparent">
              #1 Trusted Platform
            </span>
          </div>
        </div>
      </motion.div> */}

      {/* Updated Banner with better structure */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-sacred-gold via-kumkum-500 to-sacred-gold text-white">
        <div className="relative py-3 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/om-pattern.png')] bg-repeat-x opacity-10" />
          <div className="absolute inset-0 animate-shine" />
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center justify-center gap-12 relative z-10"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            >
              {floatingMessages.map((message, i) => (
                <span key={i} className="whitespace-nowrap text-sm font-medium">
                  {message}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* Questions Section - Updated for better PC view */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            {/* Updated Trusted Platform Badge with consistent positioning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: -15 }}
              className="absolute -top-4 left-0 md:-left-8 z-20 transform md:translate-x-0"
            >
              <div className="bg-gradient-to-r from-sacred-gold to-sacred-copper p-[1px] rounded-full shadow-lg">
                <div className="bg-white px-4 md:px-6 py-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-lg">🏆</span>
                    <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-sacred-gold to-sacred-copper bg-clip-text text-transparent whitespace-nowrap">
                      #1 Trusted Platform
                    </span>
                  </div>
                </div>
              </div>
              {/* Enhanced decorative elements */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-sacred-gold text-xl md:text-2xl">✨</span>
              </motion.div>
            </motion.div>

            {/* Updated Questions Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuestion}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative group"
              >
                <motion.div 
                  className="text-xl md:text-4xl lg:text-5xl text-kumkum-800 font-medium
                            backdrop-blur-sm bg-white/40 p-6 md:p-8 lg:p-10 rounded-2xl 
                            border-2 border-sacred-gold/20 shadow-lg shadow-sacred-gold/5 
                            relative z-10 overflow-hidden text-center
                            hover:bg-white/50 transition-all duration-300
                            mx-auto"
                >
                  {/* Enhanced animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sacred-gold/10 via-transparent to-sacred-copper/10 
                              blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Question text with improved styling */}
                  <div className="relative z-10">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r 
                                 from-sacred-copper via-kumkum-800 to-sacred-gold
                                 font-bold tracking-wide leading-relaxed">
                      {catchyQuestions[activeQuestion]}
                    </span>
                  </div>

                  {/* Enhanced decorative elements */}
                  <motion.div 
                    className="absolute top-4 right-4 text-sacred-gold/20 text-4xl md:text-5xl"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content Grid */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div className="space-y-10 text-center lg:text-left">
            {/* Enhanced heading */}
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Unlock Your
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-sacred-copper via-sacred-gold to-sacred-copper animate-shimmer bg-[length:200%_auto]">
                  Destined Path
                </span>
              </motion.h1>
            </div>

            {/* Floating testimonials */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center gap-1 text-sacred-gold mb-1">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <FaStar key={j} size={12} />
                    ))}
                  </div>
                  <p className="text-sm text-kumkum-800">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>

            {/* New Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {uniqueFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 
                           border border-sacred-gold/20 hover:shadow-lg transition-all duration-300
                           hover:border-sacred-gold/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sacred-gold/5 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-kumkum-900 font-bold">{feature.title}</h3>
                    <p className="text-sm text-kumkum-700 mt-1">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Price Promise */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-sacred-gold/10 to-sacred-copper/10 p-4 rounded-xl border border-sacred-gold/20"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="text-xl">🏆</span>
                <span className="text-kumkum-800 font-medium">
                  Price Match Guarantee: Found cheaper? Get extra 10 mins FREE!
                </span>
              </div>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-kumkum-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">500+ Online Now</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎥</span>
                <span className="font-medium">Video Call Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🤖</span>
                <span className="font-medium">AI-Powered Matching</span>
              </div>
            </div>

            {/* Enhanced CTA section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-sacred-gold to-sacred-copper 
                           text-white rounded-xl font-medium shadow-lg group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sacred-copper to-sacred-gold 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>Start Free Reading</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
                <Link href="/all-services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-sacred-copper/20 text-kumkum-900 rounded-xl font-medium hover:bg-sacred-copper/5 transition-all group"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-copper to-sacred-gold group-hover:text-kumkum-900 transition-all flex items-center">
                      Explore Services <span className="ml-2">✨</span>
                    </span>
                  </motion.button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-kumkum-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Online Now
                </div>
                <div className="flex items-center gap-2">
                  🔒 100% Private
                </div>
                <div className="flex items-center gap-2">
                  ⚡ Instant Connect
                </div>
              </div>
            </div>
          </motion.div>

          {/* Updated right content with better mobile positioning */}
          <motion.div className="relative">
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-sacred-gold/10 via-sacred-copper/5 to-transparent rounded-full blur-3xl transform -translate-y-4" />
              
              <div className="relative w-full h-full">
                {!imageError ? (
                  <Image
                    src="/astrologer-new.png"
                    alt="Expert Astrologer"
                    fill
                    className="object-contain"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sacred-gold/20 to-sacred-copper/20 rounded-full">
                    <span className="text-6xl">✨</span>
                  </div>
                )}
              </div>

              {/* Updated Expert Verified card with responsive positioning */}
              <motion.div
                animate={{ y: [-10, 10] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute md:top-10 top-0 md:-left-4 left-0 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-sacred-gold/20 z-10 md:translate-y-0 -translate-y-full"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sacred-gold to-sacred-copper flex items-center justify-center">
                    <FaStar className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-kumkum-900">Expert Verified</div>
                    <div className="text-xs text-kumkum-700">Top 1% Astrologer</div>
                  </div>
                </div>
              </motion.div>

              {/* Updated Rating card with responsive positioning */}
              <motion.div
                animate={{ y: [-5, 5] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute md:bottom-10 bottom-0 md:-right-4 right-0 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-sacred-gold/20 z-10 md:translate-y-0 translate-y-full"
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-kumkum-900">
                    <span className="text-sacred-gold">4.9</span> / 5.0
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-sacred-gold text-xs" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-kumkum-700 mt-1">
                  Based on 10K+ readings
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bottom Banner */}
      <div className="bg-gradient-to-r from-sacred-gold/5 via-white/80 to-sacred-copper/5 
                    backdrop-blur-sm border-t border-sacred-gold/10 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-kumkum-800">
            <div className="flex items-center gap-2">
              <span>📱</span> Modern App Experience
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span> Bank-Grade Security
            </div>
            <div className="flex items-center gap-2">
              <span>🌍</span> Global Astrologers
            </div>
            <div className="flex items-center gap-2">
              <span>💫</span> Exclusive Remedies
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
