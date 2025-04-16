'use client'
import React from 'react'
import * as motion from "framer-motion/client"
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

const words = [
  "Your Destiny Awaits",
  "Discover Your Path",
  "Connect With The Stars",
  "Transform Your Life"
]

export const GlowingText = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600"
      >
        {words[currentIndex]}
      </motion.div>
    </AnimatePresence>
  )
}
