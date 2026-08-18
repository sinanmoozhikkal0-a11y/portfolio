"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function BlurText({ text, className = "", delay = 0.9 }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      }
    }
  }), [delay]);

  const wordVariants = useMemo(() => ({
    hidden: { opacity: 0, filter: "blur(8px)", y: 5 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Premium ease-out
      }
    }
  }), []);

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
