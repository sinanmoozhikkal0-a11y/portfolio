"use client";

import { useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Springs for rotating around axes based on normalized mouse offsets
  const rotateX = useSpring(0, { stiffness: 90, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 90, damping: 18 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Normalized coordinates inside the card bounding box from -0.5 to 0.5
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    // Tilt limits: rotate maximum 12 degrees on x/y axes
    rotateX.set(-y * 12);
    rotateY.set(x * 12);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full flex items-center justify-center pointer-events-auto"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: hovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className={`relative ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
