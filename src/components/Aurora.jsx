"use client";

import { motion } from "framer-motion";

export default function Aurora({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000] ${className}`}>
      {/* Aurora Blob 1 - Indigo */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[55%] rounded-full bg-[radial-gradient(circle,rgba(82,39,255,0.07)_0%,rgba(82,39,255,0)_70%)] filter blur-[80px]"
      />

      {/* Aurora Blob 2 - Cream/Amber */}
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[15%] -right-[5%] w-[45%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(236,235,228,0.03)_0%,rgba(236,235,228,0)_70%)] filter blur-[90px]"
      />

      {/* Aurora Blob 3 - Ambient Accent */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[25%] left-[25%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(82,39,255,0.04)_0%,rgba(82,39,255,0)_70%)] filter blur-[100px]"
      />
    </div>
  );
}
