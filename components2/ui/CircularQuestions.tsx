'use client'
import * as motion from "framer-motion/client"
import Link from 'next/link'
import { useState, useEffect } from 'react'

const questions = [
  { text: "Love Life", icon: "❤️", color: "from-red-400 to-pink-500", link: "/blog" },
  { text: "Career Path", icon: "💼", color: "from-indigo-400 to-blue-500", link: "/blog" },
  { text: "Wellness", icon: "🌟", color: "from-green-400 to-emerald-500", link: "/blog" },
  { text: "Spirituality", icon: "🕉️", color: "from-amber-400 to-orange-500", link: "/blog" },
  { text: "Future Goals", icon: "🎯", color: "from-purple-400 to-violet-500", link: "/blog" },
]

export const CircularQuestions = () => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center -translate-x-[35px] sm:-translate-x-[100px] -translate-y-[40px] sm:-translate-y-[40px]">
      <div className="relative w-[240px] h-[240px] sm:w-[400px] sm:h-[400px]">
        {questions.map((question, index) => {
          const angle = (index * 360) / questions.length
          const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 210 // Reduced mobile radius
          const adjustedAngle = angle + 180 // Rotate to start from top
          const x = radius * Math.cos((adjustedAngle * Math.PI) / 180)
          const y = radius * Math.sin((adjustedAngle * Math.PI) / 180)

          return (
            <Link href={question.link} key={index}>
              <motion.div
                className="absolute top-1/2 left-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: x,
                  y: y,
                  z: 30
                }}
                whileHover={{
                  scale: 1.15,
                  z: 50,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className={`bg-gradient-to-r ${question.color} px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/30 cursor-pointer transform-gpu transition-all duration-300 scale-75 sm:scale-100`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{question.icon}</span>
                    <span className="text-sm sm:text-base font-semibold text-white tracking-wide whitespace-nowrap">{question.text}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
