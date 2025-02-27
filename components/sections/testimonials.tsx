'use client';

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "JyotishConnect's guidance has been invaluable in my business decisions. The astrologers here are truly gifted!",
      name: "Priya Sharma",
      designation: "Entrepreneur",
      src: "https://img.freepik.com/free-photo/young-girl-red-t-shirt-jean-jacket-leaning-chin-hand-smiling-looking-happy_176474-86837.jpg",
    },
    {
      quote: "I was skeptical at first, but the accuracy of my Kundli reading was astonishing. Highly recommended!",
      name: "Rahul Patel",
      designation: "Software Engineer",
      src: "https://img.freepik.com/free-photo/smiling-businessman-with-phone-downtown_23-2147689110.jpg?t=st=1737013649~exp=1737017249~hmac=7331fe6f4117d180361321698583a009889832add18bea74a34a84f7b8b90202&w=1480",
    },
    {
      quote: "The Vastu consultation helped transform my home into a peaceful sanctuary. Thank you, JyotishConnect!",
      name: "Anita Desai",
      designation: "Teacher",
      src: "https://img.freepik.com/free-photo/woman-teaching-classroom_23-2151696436.jpg",
    },
    
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

