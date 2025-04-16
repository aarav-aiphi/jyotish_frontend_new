"use client"
import Link from "next/link"
import * as motion from "framer-motion/client"
// import { freeServices } from "@/constants/freeServices"
import { freeServices } from "@/app/constants/freeServices"

export const FreeServices = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper animate-sacred-shimmer bg-[length:200%_auto]">
              Sacred Astrology Services
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper rounded-full"></div>
          </h2>
          <p className="text-sacred-copper/80 text-lg max-w-2xl mx-auto font-medium">
            Unveil your destiny through ancient Vedic wisdom
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freeServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.link}>
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/50 to-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {service.icon}
                    </div>
                    <div className="text-amber-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      प्रारंभ करें →
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-amber-900 group-hover:text-orange-700 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-amber-700">
                    {service.description}
                  </p>

                  {/* Bottom decorative border */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/all-services" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 hover:scale-105 transition-all duration-300"
            >
              Explore Sacred Services
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            <Link href="/consult-astro" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-sacred-gold to-sacred-copper text-white font-semibold hover:shadow-lg hover:shadow-orange-200 hover:scale-105 transition-all duration-300"
            >
              Consult Astrologer Now
              <span className="ml-2">✨</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
