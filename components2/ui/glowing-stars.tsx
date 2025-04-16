'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export const GlowingStarsText = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return

      const rect = glowRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      glowRef.current.style.setProperty('--mouse-x', `${x}px`)
      glowRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    const element = glowRef.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <motion.div
      ref={glowRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-50 blur-xl transition-all"
          style={{
            transform: 'translate(var(--mouse-x, 0) var(--mouse-y, 0)) translateZ(0)',
          }}
        />
      </div>
      {children}
    </motion.div>
  )
}
