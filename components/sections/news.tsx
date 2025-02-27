'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Image from 'next/image'

const newsItems = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-42-54-HkDrNTVsoGaO8hYyTQHvhdc3L5KXyf.png",
    title: "Decoding JyotishConnect's Fortunes: How The Astrology Startup Hit 4X Profit Growth",
    source: "Inc42",
    date: "Nov 7, 2023"
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-42-54-HkDrNTVsoGaO8hYyTQHvhdc3L5KXyf.png",
    title: "Astro tech Startup, JyotishConnect, appoints Anmol Jain as the new Co-founder",
    source: "CXO",
    date: "Nov 3, 2023"
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-42-54-HkDrNTVsoGaO8hYyTQHvhdc3L5KXyf.png",
    title: "EXCLUSIVE: Rs 37k salary to Rs 500 cr company - How an astrology prediction...",
    source: "ET NOW",
    date: "Nov 4, 2023"
  }
]

export function NewsSection() {
  return (
    <section className="py-20 bg-yellow-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          JyotishConnect IN NEWS
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.source}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

