'use client';
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  {
    name: "Vedic Astrology",
    description: "Gain insights into your life path and destiny",
    image: "https://pujayagna.com/cdn/shop/products/horoscope-2015_grande.jpg?v=1569021287"
  },
  {
    name: "Tarot Reading",
    description: "Uncover hidden truths and future possibilities",
    image: "https://images.unsplash.com/photo-1627764574958-fb54cd7d7448?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRhcm90fGVufDB8fDB8fHww"
  },
  {
    name: "Numerology",
    description: "Discover the mystical significance of numbers in your life",
    image: "https://img.freepik.com/free-photo/numerology-concept-still-life_23-2150171520.jpg?t=st=1737013108~exp=1737016708~hmac=f036da630ead226b2f117fa137b8e77b0ee4e3c12135584afee482da3d62074b&w=1480"
  },
  {
    name: "Vastu Shastra",
    description: "Harmonize your living spaces with cosmic energies",
    image: "https://i.pinimg.com/736x/c1/47/3e/c1473ef3855bd7c5fcc8ab99c7cddbaa.jpg"
  }
];

export function ServicesSection() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center">
          Our Spiritual Services
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Discover the cosmic guidance you need for your journey
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
            <div className="flex-[0_0_300px]" key={index}>
              <Card className="w-full h-full shadow-lg transform transition-transform hover:scale-105">
                <CardHeader className="relative h-[250px]">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name || "Service"}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-xl font-semibold text-center">{service.name}</CardTitle>
                  <CardDescription className="text-center mt-2">{service.description}</CardDescription>
                </CardContent>
                <CardFooter className="justify-center pb-4">
                  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors">
                    Book Consultation
                  </button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

