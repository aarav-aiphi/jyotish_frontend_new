'use client';

import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const astrologers = [
  {
    name: "Pandit Sharma",
    specialty: "Vedic Astrology",
    image: "https://img.freepik.com/free-photo/indian-stylish-man-yellow-traditional-clothes-with-white-scarf-posed-outdoor-against-wooden-background-shows-namaste-hands-sign_627829-12668.jpg",
  },
  {
    name: "Dr. Gupta",
    specialty: "Numerology",
    image: "https://img.freepik.com/free-photo/positive-indian-financial-advisor-holding-open-folder_1262-17502.jpg",
  },
  {
    name: "Acharya Joshi",
    specialty: "Tarot Reading",
    image: "https://img.freepik.com/free-photo/vertical-shot-indian-spiritual-male_181624-45111.jpg",
  },
  {
    name: "Yogini Desai",
    specialty: "Vastu Shastra",
    image: "https://img.freepik.com/free-photo/celebration-deity-navratri_23-2151220049.jpg",
  },
  {
    name: "Pandit Sharma",
    specialty: "Vedic Astrology",
    image: "https://img.freepik.com/free-photo/indian-stylish-man-yellow-traditional-clothes-with-white-scarf-posed-outdoor-against-wooden-background-shows-namaste-hands-sign_627829-12668.jpg",
  },
  {
    name: "Dr. Gupta",
    specialty: "Numerology",
    image: "https://img.freepik.com/free-photo/positive-indian-financial-advisor-holding-open-folder_1262-17502.jpg",
  },
  {
    name: "Acharya Joshi",
    specialty: "Tarot Reading",
    image: "https://img.freepik.com/free-photo/vertical-shot-indian-spiritual-male_181624-45111.jpg",
  },
  {
    name: "Yogini Desai",
    specialty: "Vastu Shastra",
    image: "https://img.freepik.com/free-photo/celebration-deity-navratri_23-2151220049.jpg",
  },
];

export function AstrologersSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {astrologers.map((astrologer, index) => (
            <div className="flex-[0_0_300px]" key={index}>
              <Card className="w-full h-full shadow-lg transform transition-transform hover:scale-105">
                <CardHeader className="relative h-[250px]">
                  <Image
                    src={astrologer.image || "/placeholder.svg"}
                    alt={astrologer.name}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-xl font-semibold text-center">{astrologer.name}</CardTitle>
                  <CardDescription className="text-center mt-2">{astrologer.specialty}</CardDescription>
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
      
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md hover:bg-white"
        onClick={scrollPrev}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md hover:bg-white"
        onClick={scrollNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
