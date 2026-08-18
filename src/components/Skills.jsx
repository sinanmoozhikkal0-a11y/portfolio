import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchApi } from "@/utils/api";
import "../styles/Skills.css";

const DEFAULT_CATEGORIES = [
  {
    categoryNum: "01",
    categoryTitle: "UI/UX DESIGN",
    description: "CREATING CLEAN, MODERN, AND USER-CENTERED INTERFACES FOCUSED ON USABILITY, ACCESSIBILITY, AND SEAMLESS USER EXPERIENCE.",
    tags: ["WIREFRAMING", "PROTOTYPING", "FIGMA"]
  },
  {
    categoryNum: "02",
    categoryTitle: "FRONTEND DEVELOPMENT",
    description: "BUILDING MODULAR, RESPONSIVE, AND HIGH-PERFORMANCE WEB APPLICATIONS USING MODERN JAVASCRIPT UTILITIES AND FRAMEWORKS.",
    tags: ["REACT", "TAILWIND CSS", "NEXT.JS"]
  },
  {
    categoryNum: "03",
    categoryTitle: "APP DESIGN",
    description: "CRAFTING INTUITIVE MOBILE APP EXPERIENCES WITH SMOOTH NAVIGATION, CONSISTENT LAYOUTS, AND USER-FRIENDLY INTERACTIONS.",
    tags: ["IOS & ANDROID", "MOBILE UI KITS", "PROTOTYPING"]
  }
];

export default function Skills({ initialSkills }) {
  const [skillsList, setSkillsList] = useState(initialSkills || DEFAULT_CATEGORIES);

  useEffect(() => {
    if (!initialSkills) {
      fetchApi("/skills")
        .then(res => {
          if (res.data && res.data.length > 0) {
            // Filter to top 3 items if served from custom backend
            setSkillsList(res.data.slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [initialSkills]);

  return (
    <section id="skills" className="skills-section py-20 md:py-28">
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
        {/* Section title header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-black tracking-[0.25em] uppercase block mb-3">
              02 / CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
              <span>Services & Skills</span>
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
          </div>
          <p className="text-sm font-bold max-w-sm leading-relaxed">
            Core specialized capabilities in UI/UX design, frontend development, and mobile app design.
          </p>
        </motion.div>

        {/* Numbered Horizontal List Container */}
        <div className="skills-item-border border-t flex flex-col">
          {skillsList.slice(0, 3).map((item, idx) => {
            const numStr = item.categoryNum || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
            const title = item.categoryTitle || item.name || "Capability";

            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group relative skills-item-border border-b py-10 md:py-12 px-2 md:px-6 transition-all duration-400 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              >
                {/* Left Side: Number — Title & Description */}
                <div className="flex flex-col flex-1 max-w-3xl">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                      {numStr} —
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight group-hover:opacity-75 transition-opacity">
                      {title}
                    </h3>
                  </div>

                  {/* Description Underneath */}
                  <p className="text-sm sm:text-base font-bold leading-relaxed pl-0 sm:pl-1 mt-2">
                    {item.description}
                  </p>

                  {/* Optional Tech Tags */}
                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="skills-tag-item text-[10px] font-black tracking-widest uppercase border px-3 py-1 rounded-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Arrow Icon */}
                <div className="flex items-center gap-6 relative">
                  {/* Arrow Action Icon */}
                  <div className="skills-arrow-btn w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm">
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
