"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function IntroLoader() {
  const { isIntroActive, setIsIntroActive } = useTransition();

  useEffect(() => {
    // Keep loader active for 800ms, then transition out
    const timer = setTimeout(() => {
      setIsIntroActive(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [setIsIntroActive]);

  return (
    <AnimatePresence>
      {isIntroActive && (
        <motion.div
          initial={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ 
            opacity: 0, 
            filter: "blur(20px)",
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 w-screen h-screen z-[99999] bg-[#000000] flex items-center justify-center select-none"
        >
          <div className="relative flex items-center justify-center">
            {/* Subtle glow effect behind the logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.22, scale: 1.35 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute w-[220px] h-[220px] bg-[var(--color-theme-yellow)] rounded-full filter blur-[80px] pointer-events-none"
            />
            
            {/* Centered Logo with shared layout ID */}
            <motion.div
              layoutId="logo"
              initial={{ opacity: 0, scale: 0.82, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="logo-text text-white text-5xl md:text-7xl font-bold tracking-tight z-10"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              sinan.
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
