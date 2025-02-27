'use client';
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const blogPosts = [
  {
    title: "Understanding Your Birth Chart",
    excerpt: "Discover the secrets hidden in your Vedic birth chart and how it influences your life path.",
    image: "https://www.indastro.com/app/webroot/files/Image/Construction-of-a-chart(1).jpg"
  },
  {
    title: "The Power of Certainly",
    excerpt: "Learn how different gemstones can enhance your astrological energies and bring positive changes.",
    image: "https://img.freepik.com/free-photo/numerology-concept-composition_23-2150354469.jpg"
  },
  {
    title: "The Power of Gemstones in Astrology",
    excerpt: "Learn how different gemstones can enhance your astrological energies and bring positive changes.",
    image: "https://img.freepik.com/free-photo/numerology-concept-with-pebbles_23-2150062946.jpg"
  },
  {
    title: "Navigating Mercury Retrograde",
    excerpt: "Tips and tricks to survive and thrive during the challenging Mercury Retrograde period.",
    image: "https://img.freepik.com/free-vector/hand-drawn-celestial-element_23-2151250017.jpg"
  }
];

const responsive = {
  superLargeDesktop: {
    // screens greater than 1440px
    breakpoint: { max: 4000, min: 1440 },
    items: 3
  },
  desktop: {
    // screens between 1024px and 1440px
    breakpoint: { max: 1440, min: 1024 },
    items: 3
  },
  tablet: {
    // screens between 768px and 1024px
    breakpoint: { max: 1024, min: 768 },
    items: 2
  },
  mobile: {
    // screens less than 768px
    breakpoint: { max: 768, min: 0 },
    items: 1
  }
};

export function BlogSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Astrological Insights
        </h2>
        <p className="text-xl text-center mb-8 text-gray-600">
          Expand your knowledge with our latest astrological articles
        </p>

        <Carousel 
          responsive={responsive}
          infinite={true}
          autoPlay={false}
          keyBoardControl={true}
          containerClass="mx-auto"
          itemClass="px-2"
        >
          {blogPosts.map((post, index) => (
            <Card key={index} className="mt-6">
              <CardHeader className="relative h-[275px] p-0">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors">
                  Read More
                </button>
              </CardFooter>
            </Card>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
