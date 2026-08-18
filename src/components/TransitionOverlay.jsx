"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function TransitionOverlay() {
  const { transitionState } = useTransition();
  const [showText, setShowText] = useState(false);

  // Sync text reveal with the curtain covering the screen
  useEffect(() => {
    if (transitionState === "exiting") {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 350); // Show text when curtain is nearly full
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [transitionState]);

  if (transitionState === "idle") return null;

  // Path coordinates for exit (cover screen)
  const exitEmpty = "M 0,100 L 100,100 L 100,100 L 0,100 Z";
  const exitMorph = "M 0,100 Q 50,-10 100,100 L 100,0 L 0,0 Z";
  const exitFull = "M 0,100 L 100,100 L 100,0 L 0,0 Z";

  // Path coordinates for enter (reveal screen)
  const enterFull = "M 0,0 L 100,0 L 100,100 L 0,100 Z";
  const enterMorph = "M 0,0 Q 50,110 100,0 L 100,100 L 0,100 Z";
  const enterEmpty = "M 0,0 L 100,0 L 100,0 L 0,0 Z";

  return (
    <div className="fixed inset-0 w-screen h-screen z-[99999] pointer-events-none select-none">
      {/* Morphing SVG Liquid Curtain */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-auto" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {transitionState === "exiting" ? (
          <motion.path
            initial={{ d: exitEmpty }}
            animate={{ d: [exitEmpty, exitMorph, exitFull] }}
            transition={{
              duration: 0.8,
              times: [0, 0.45, 0.8],
              ease: [0.76, 0, 0.24, 1] // Awwwards custom cubic-bezier
            }}
            fill="#FFFFFF" // Stark white contrast curtain
          />
        ) : (
          <motion.path
            initial={{ d: enterFull }}
            animate={{ d: [enterFull, enterMorph, enterEmpty] }}
            transition={{
              duration: 0.8,
              times: [0, 0.45, 0.8],
              ease: [0.76, 0, 0.24, 1]
            }}
            fill="#FFFFFF"
          />
        )}
      </svg>

      {/* High-Contrast Centered Overlay Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100000]">
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-black text-4xl md:text-6xl font-bold tracking-[0.3em] font-heading text-center"
            >
              SINAN
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
