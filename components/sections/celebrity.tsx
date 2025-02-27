'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import Image from 'next/image'

const celebrities = [
  {
    name: "Mandira Bedi",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-43-13-johOf3tOfsGimoP3W0uHvSZM33PxRB.png",
    message: "Secret of Mandira Bedi's success 🙂"
  },
  {
    name: "Shweta Tiwari",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-43-13-johOf3tOfsGimoP3W0uHvSZM33PxRB.png",
    message: "Shweta Tiwari has a message for you. Tap to watch 👆"
  },
  {
    name: "Bharti Singh",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-15%2016-43-13-johOf3tOfsGimoP3W0uHvSZM33PxRB.png",
    message: "Bharti Singh never thought to come on television 🙂"
  }
]

export function CelebritySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50 to-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          OUR CELEBRITY CUSTOMERS
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {celebrities.map((celebrity, index) => (
            <motion.div
              key={celebrity.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={celebrity.image || "/placeholder.svg"}
                      alt={celebrity.name}
                      width={100}
                      height={100}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{celebrity.name}</h3>
                    <p className="text-sm text-muted-foreground">{celebrity.message}</p>
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

