import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchApi } from "@/utils/api";
import "../styles/About.css";

function AnimatedText({ text, className = "" }) {
  const words = useMemo(() => (text ? text.split(" ") : []), [text]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  }), []);

  const wordVariants = useMemo(() => ({
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }), []);

  if (!text) return null;

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`flex flex-wrap gap-x-1.5 leading-relaxed ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-0.5">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

export default function About({ initialData }) {
  const [data, setData] = useState(initialData || {
    bioTitle: "ABOUT",
    bioParagraph1: "HI, I'M SINAN M. I AM A CREATIVE AND PASSIONATE UI/UX DESIGNER WITH A STRONG INTEREST IN FRONT-END DEVELOPMENT.",
    bioParagraph2: "I ENJOY CREATING INTUITIVE, USER-CENTERED DIGITAL EXPERIENCES AND BUILDING SIMPLE YET EFFECTIVE PROTOTYPES. CURRENTLY LEARNING REACT TO DEVELOP INTERACTIVE WEB APPLICATIONS.",
    philosophyQuote: "MY GOAL IS TO GROW AS A DESIGNER-DEVELOPER WHO CAN DESIGN AND BUILD FULLY FUNCTIONAL WEBSITES AND APPLICATIONS.",
    profileImage: "/bw_about.png",
    experienceTimeline: [
      {
        role: "UI/UX DESIGNER & FRONT-END DEVELOPER (INTERN)",
        company: "FEBNO TECHNOLOGIES — MALAPPURAM",
        period: "10/2025 — PRESENT",
      }
    ]
  });

  useEffect(() => {
    if (!initialData) {
      fetchApi("/about")
        .then(res => {
          if (res.data) {
            setData(prev => ({
              ...prev,
              bioTitle: res.data.bioTitle || prev.bioTitle,
              bioParagraph1: res.data.bioParagraph1 || prev.bioParagraph1,
              bioParagraph2: res.data.bioParagraph2 || prev.bioParagraph2,
              philosophyQuote: res.data.philosophyQuote || prev.philosophyQuote,
              profileImage: res.data.profileImage || prev.profileImage,
              experienceTimeline: (res.data.experienceTimeline && res.data.experienceTimeline.length > 0) 
                ? res.data.experienceTimeline 
                : prev.experienceTimeline
            }));
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Heading and Parallax Image Reveal */}
          <div className="lg:col-span-5 flex flex-col w-full">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="about-title"
            >
              {data.bioTitle} <span className="bold-title">ME</span>
            </motion.h2>

            {/* Parallax mask frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="about-image-wrapper"
            >
              <motion.div
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                className="image-reveal-mask"
              />
              <motion.div
                className="about-image"
                style={{ y: imageY }}
              >
                <img
                  src={data.profileImage || "/bw_about.png"}
                  alt="Sinan Portrait"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Bio Details, Quote, Experience */}
          <div className="lg:col-span-7 flex flex-col space-y-12 lg:pt-14">

            {/* Bio text paragraph reveals */}
            <div className="space-y-6 text-zinc-400 text-base leading-relaxed tracking-wide font-normal">
              <AnimatedText
                text={data.bioParagraph1}
                className="text-[var(--text-primary)] text-lg font-normal tracking-wide"
              />
              <AnimatedText
                text={data.bioParagraph2}
              />
            </div>

            {/* Design Philosophy */}
            {data.philosophyQuote && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="about-philosophy-quote">
                  "{data.philosophyQuote}"
                </blockquote>
              </motion.div>
            )}

            {/* Experience timeline grid list */}
            {data.experienceTimeline && data.experienceTimeline.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col pt-2"
              >
                <h3 className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">
                  PROFESSIONAL TIMELINE
                </h3>
                <div className="flex flex-col">
                  {data.experienceTimeline.map((exp, idx) => (
                    <div key={idx} className="about-exp-item flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
                      <div className="flex flex-col">
                        <span className="text-[var(--text-primary)] text-sm font-semibold uppercase tracking-wider">{exp.role}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">{exp.company}</span>
                      </div>
                      <span className="text-xs font-semibold tracking-widest text-zinc-400 sm:text-right uppercase">
                        {exp.period}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
