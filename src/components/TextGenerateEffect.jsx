"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function TextGenerateEffect({ words, className = "", delay = 0.8 }) {
  const controls = useAnimation();
  const wordsArray = words.split(" ");

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate={controls} className={className}>
      {wordsArray.map((word, idx) => (
        <motion.span key={idx} variants={wordVariants} className="inline-block mr-1">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
