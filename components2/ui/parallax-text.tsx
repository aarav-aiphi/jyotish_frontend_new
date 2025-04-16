"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

export const ParallaxText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start end", "end start"]
  });

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    { damping: 50 }
  );

  return (
    <div ref={textRef} className="relative overflow-hidden">
      <motion.div
        style={{ x: translateX }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
