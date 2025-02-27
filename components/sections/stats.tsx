'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    number: "50,000+",
    label: "Satisfied Clients"
  },
  {
    number: "1000+",
    label: "Expert Astrologers"
  },
  {
    number: "24/7",
    label: "Customer Support"
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary/10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: [0, 0.71, 0.2, 1.01]
              }}
            >
              <Card className="text-center bg-background/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

