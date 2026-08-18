import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTransition } from "@/context/TransitionContext";
import { fetchApi } from "@/utils/api";

import BlurText from "./BlurText";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";
import "../styles/Hero.css";

export default function Hero({ initialData }) {
  const [data, setData] = useState(initialData || {
    badgeText: "AVAILABLE FOR FREELANCE PROJECTS",
    heading: "HI, I'M SINAN —",
    highlightText: "A UI/UX DESIGNER & FRONTEND DEVELOPER",
    description: "I DESIGN INTUITIVE DIGITAL EXPERIENCES AND BUILD MODERN, HIGH-PERFORMANCE WEBSITES USING REACT, JAVASCRIPT, AND THOUGHTFUL USER-CENTERED DESIGN.",
    marqueeText: "FIGMA • REACT • JAVASCRIPT • FRAMER MOTION • TAILWIND • UI/UX",
    cta1Text: "EXPLORE WORK",
    cta1Link: "#projects",
    cta2Text: "GET IN TOUCH",
    cta2Link: "#contact",
    resumeUrl: "/cv.html"
  });

  useEffect(() => {
    if (!initialData) {
      fetchApi("/hero")
        .then(res => {
          if (res.data) {
            setData(prev => ({
              ...prev,
              badgeText: res.data.badgeText || prev.badgeText,
              heading: res.data.heading || prev.heading,
              highlightText: res.data.highlightText || prev.highlightText,
              description: res.data.description || prev.description,
              marqueeText: res.data.marqueeText || prev.marqueeText,
              cta1Text: res.data.cta1Text || prev.cta1Text,
              cta1Link: res.data.cta1Link || prev.cta1Link,
              cta2Text: res.data.cta2Text || prev.cta2Text,
              cta2Link: res.data.cta2Link || prev.cta2Link,
              resumeUrl: res.data.resumeUrl || prev.resumeUrl
            }));
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const containerRef = useRef(null);
  const { isIntroActive } = useTransition();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const textDriftX = useTransform(mouseX, [0, windowSize.width], [-5, 5]);
  const textDriftY = useTransform(mouseY, [0, windowSize.height], [-5, 5]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleScrollVisibility = () => {
      if (window.scrollY > window.innerHeight) {
        setIsHeroVisible(false);
      } else {
        setIsHeroVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScrollVisibility, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScrollVisibility);
    };
  }, [mouseX, mouseY]);

  const handleScrollTo = (e, targetId) => {
    if (targetId && targetId.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(targetId.substring(1));
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <section id="home" ref={containerRef} className="hero-section select-none relative w-full overflow-hidden flex items-center justify-center min-h-screen">

      {/* Background Interactive Faint Glow */}
      <motion.div 
        className="hero-bg-glow"
        style={{
          left: glowX,
          top: glowY
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start px-6 md:px-12 pt-0 pb-0">
        
        {/* Parallax typography layers */}
        <motion.div 
          className="flex flex-col items-start z-10 w-full"
          style={{ x: textDriftX, y: textDriftY }}
        >
          {/* Eyebrow badge */}
          <div className="overflow-hidden mb-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={!isIntroActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="freelance-badge"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>{data.badgeText}</span>
            </motion.div>
          </div>

          {/* Heading Prefix */}
          <div className="text-mask overflow-hidden mb-2">
            <motion.h1 
              initial={{ y: "100%", opacity: 0 }}
              animate={!isIntroActive ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="hero-title-line"
            >
              {data.heading}
            </motion.h1>
          </div>

          {/* Highlight Text Line */}
          <div className="text-mask overflow-hidden mb-8">
            <motion.h1 
              initial={{ y: "100%", opacity: 0 }}
              animate={!isIntroActive ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="hero-title-line"
            >
              <span className="bold-white">{data.highlightText}</span>
            </motion.h1>
          </div>

          {/* Editorial Subtitle with Blur text reveal */}
          <div className="min-h-[50px] w-full max-w-lg mb-10 text-[#888888]">
            {!isIntroActive && (
              <BlurText
                text={data.description}
                className="text-sm md:text-base font-normal leading-relaxed tracking-wide"
                delay={0.7}
              />
            )}
          </div>

          {/* Action CTAs */}
          <motion.div 
            initial="hidden"
            animate={!isIntroActive ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 1.0
                }
              }
            }}
            className="flex flex-wrap items-center gap-6 z-20 pointer-events-auto"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <MagneticButton
                href={data.cta1Link}
                onClick={(e) => handleScrollTo(e, data.cta1Link)}
                className="hero-btn-primary group"
              >
                <span>{data.cta1Text}</span>
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <MagneticButton
                href={data.cta2Link}
                onClick={(e) => handleScrollTo(e, data.cta2Link)}
                className="hero-btn-secondary"
              >
                {data.cta2Text}
              </MagneticButton>
            </motion.div>

            {data.resumeUrl && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                <MagneticButton
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-secondary"
                >
                  DOWNLOAD CV
                </MagneticButton>
              </motion.div>
            )}
          </motion.div>

          {/* Horizontal Tech Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={!isIntroActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, delay: 1.3, ease: "easeOut" }}
            className="w-full mt-16 pointer-events-none"
          >
            <Marquee text={data.marqueeText} speed={25} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
