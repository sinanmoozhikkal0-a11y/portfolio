"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, className = "", onClick, href, ...props }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 120, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const distanceX = clientX - (left + width / 2);
    const distanceY = clientY - (top + height / 2);
    
    // Magnetic pull: offset button position by 35% of vector from center
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isLink = !!href;
  const Tag = isLink ? motion.a : motion.button;

  // Set up animation states
  const motionProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { x: springX, y: springY },
    className: className,
    ...(isLink ? { href, onClick } : { onClick }),
    ...props
  };

  return <Tag {...motionProps}>{children}</Tag>;
}
