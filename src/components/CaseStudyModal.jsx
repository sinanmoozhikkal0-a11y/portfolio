import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck, Cpu, Code2, Users } from "lucide-react";

export default function CaseStudyModal({ project, onClose }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!project) return null;

  // Fallback defaults for legacy presets
  const presetDetails = {
    "01": {
      role: "LEAD UI/UX DESIGNER & ENGINEER",
      duration: "3 MONTHS (Q2 2025)",
      problem: "USERS NAVIGATING DIGITAL FINANCIAL SERVICES ARE OFTEN MET WITH FRAGMENTED CHECKOUT FLOWS, COMPLEX NAVIGATION PATHS, AND OVERWHELMING DATA TABLES.",
      challenge: "DESIGNING A UNIFIED MOBILE-FIRST ECOSYSTEM CONNECTING PAYMENTS, DIGITAL CARDS, AND PRODUCT DISCOVERY WITH SUB-SECOND PAGE TRANSITIONS.",
      solution: "CREATED AN INTUITIVE CARD-BASED DESIGN SYSTEM WITH HIGH-CONTRAST TYPOGRAPHY, SEAMLESS GESTURE CONTROLS, AND REAL-TIME TRANSACTION NOTIFICATIONS.",
      deliverables: ["MOBILE ECOSYSTEM DESIGN SYSTEM", "HIGH-FIDELITY PRODUCT FLOW PROTOTYPES", "CUSTOM MICRO-INTERACTIONS", "FINTECH PAYMENT GATEWAY UI"]
    },
    "02": {
      role: "UI/UX DESIGNER & DEVELOPER",
      duration: "2 MONTHS (Q4 2025)",
      problem: "HIGH-END REAL ESTATE BUYERS REQUIRE CINEMATIC VISUAL PRESENTATIONS OF LUXURY DEVELOPMENTS THAT EVOKE ARCHITECTURAL PRESTIGE ONLINE.",
      challenge: "BUILDING SLOW-MOTION PARALLAX SCROLL CONTROLS, 3D PROPERTY VIEWPORTS, AND INTERACTIVE LAYOUT GALLERIES WITHOUT DEGRADING PAGE LOAD SPEED.",
      solution: "ENGINEERED A MINIMALIST ARCHITECTURAL STOREFRONT HIGHLIGHTING FLOORPLANS, LUXURY MATERIAL FINISHES, AND HIGH-DEFINITION PROPERTY TOURS.",
      deliverables: ["ARCHITECTURAL LAYOUT ENGINE", "3D PROPERTY VIEWPORT INTEGRATION", "FLUID PARALLAX CONTROLS", "HIGH-CONTRAST TYPOGRAPHY GRID"]
    },
    "03": {
      role: "LEAD FRONTEND ENGINEER",
      duration: "3 MONTHS (Q1 2026)",
      problem: "TRADITIONAL LUXURY FASHION WEBSITES STRUGGLE TO CONVEY OFFLINE BOUTIQUE ELEGANCE ONLINE, OFTEN OVERLOADING VISITORS WITH DENSE GRIDS.",
      challenge: "CREATING AN IMMERSIVE, EDITORIAL DIGITAL ARCHIVE WITH SUB-SECOND PAGE TRANSITIONS, DYNAMIC HERO SLIDERS, AND SOPHISTICATED TYPOGRAPHIC RHYTHM.",
      solution: "DESIGNED A HIGH-CONTRAST EDITORIAL AESTHETIC SHOWCASING SEASONAL COLLECTIONS WITH CUSTOM SMOOTH-SCROLLING INTERACTIONS.",
      deliverables: ["HIGH-FIDELITY EDITORIAL LAYOUT SYSTEM", "SEASONAL ARCHIVE NAVIGATION ENGINE", "CUSTOM SMOOTH PARALLAX CONTROLS", "DESIGN SYSTEM & FIGMA COMPONENT LIBRARY"]
    },
    "04": {
      role: "FULL-STACK UX ENGINEER",
      duration: "4 MONTHS (Q2 2026)",
      problem: "DEVELOPERS TESTING PROMPTS ACROSS DIFFERENT LARGE LANGUAGE MODELS ARE FORCED TO JUGGLE MULTIPLE BROWSER TABS AND COPY-PASTE CONFIGURATIONS.",
      challenge: "BUILDING A COMPLEX MULTI-PANEL SPLIT VIEW WORKSPACE THAT REMAINS FAST, COMPLETELY RESPONSIVE, AND VISUALLY MINIMAL.",
      solution: "DESIGNED A MONOSPACE DASHBOARD WITH MODULAR DRAG-AND-DROP TERMINAL SPLITS, LOCAL VERSION CACHING, AND REAL-TIME MARKDOWN PARSING.",
      deliverables: ["DRAG-AND-DROP SPLIT PANEL LAYOUT", "MONOSPACE CODE SANDBOX UI", "LOCAL SESSION VERSION CACHING", "REAL-TIME MARKDOWN TOKEN STREAM PARSER"]
    }
  }[project.num] || {
    role: "UX ENGINEER",
    duration: "ONGOING",
    problem: "STANDARD DESIGNS RELY ON HEAVY IMAGERY AND BOILERPLATE FRAMEWORKS, PRODUCING WEBSITES THAT LACK BRANDING IDENTITY AND VISUAL PREMIUM FEEL.",
    challenge: "CREATING DISTINCT VISUAL BRANDING USING A STRICT MONOCHROME COLOR SCHEME AND MINIMAL ASSETS.",
    solution: "LEVERAGED TYPOGRAPHY SCALES, INTERACTIVE HOVER PHYSICS, AND CUSTOMIZED LAYOUT TRANSITIONS TO KEEP USER ATTENTION ENGAGED WITHOUT PERFORMANCE BLOAT.",
    deliverables: ["STATIC SPA BUILD ARCHITECTURE", "DYNAMIC LAYOUT MECHANICS", "BRUTALIST INTERACTION MODELS"]
  };

  // Prioritize CMS MongoDB fields over hardcoded presets
  const roleText = project.role || presetDetails.role;
  const durationText = project.duration || presetDetails.duration;
  const problemText = project.fullDescription || project.description || presetDetails.problem;
  const challengeText = project.challenges || presetDetails.challenge;
  const solutionText = project.solutions || presetDetails.solution;
  const deliverablesList = (Array.isArray(project.features) && project.features.length > 0) 
    ? project.features 
    : presetDetails.deliverables;

  const stackArray = Array.isArray(project.stack) 
    ? project.stack 
    : typeof project.stack === "string" 
    ? project.stack.split(",").map(s => s.trim()) 
    : ["REACT", "TAILWIND"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 w-full h-full z-[9999] bg-white/95 dark:bg-black/95 backdrop-blur-md overflow-y-auto flex justify-center py-0 md:py-12 px-0 sm:px-6"
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white dark:bg-black border-0 md:border border-black/10 dark:border-white/10 text-black dark:text-white min-h-screen md:min-h-0 flex flex-col p-6 sm:p-12 md:p-16 select-none"
        >
          {/* Header Controls */}
          <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-8 mb-12">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-[0.2em] text-[#888888] uppercase mb-1">
                PROJECT {project.num || "01"} / CASE STUDY
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black dark:text-white">
                {project.title}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex items-center justify-center transition-all duration-300 group cursor-pointer focus:outline-none"
              aria-label="Close Case Study"
            >
              <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Intro Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-8">
              <div className="w-full aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-85 hover:scale-105 hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Quick Details Sidebar */}
            <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 pt-8 md:pt-0 md:pl-8 space-y-6">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#888888] block mb-2">MY ROLE</span>
                <p className="text-sm font-semibold text-black dark:text-white uppercase">{roleText}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#888888] block mb-2">TIMELINE</span>
                <p className="text-sm font-semibold text-black dark:text-white uppercase">{durationText}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#888888] block mb-2">TECHNOLOGIES</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {stackArray.map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-bold tracking-wider bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white px-2 py-0.5 rounded-sm uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Case Study Details Blocks */}
          <div className="space-y-12">
            {/* The Overview / Problem */}
            <div className="border-t border-black/10 dark:border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 flex items-center gap-2 text-black/50 dark:text-white/50">
                <Users size={16} />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">THE OVERVIEW</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {problemText}
                </p>
              </div>
            </div>

            {/* The Challenge */}
            <div className="border-t border-black/10 dark:border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 flex items-center gap-2 text-black/50 dark:text-white/50">
                <Cpu size={16} />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">THE CHALLENGE</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {challengeText}
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="border-t border-black/10 dark:border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 flex items-center gap-2 text-black/50 dark:text-white/50">
                <Code2 size={16} />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">THE SOLUTION</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {solutionText}
                </p>
              </div>
            </div>

            {/* Key Deliverables / Features */}
            <div className="border-t border-black/10 dark:border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-4 pb-12">
              <div className="md:col-span-4 flex items-center gap-2 text-black/50 dark:text-white/50">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">DELIVERABLES</span>
              </div>
              <div className="md:col-span-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deliverablesList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 font-semibold bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-sm">
                      <ArrowRight size={12} className="text-black dark:text-white" />
                      <span>{item.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Close Actions */}
          <div className="mt-auto border-t border-black/10 dark:border-white/10 pt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="text-xs font-bold tracking-[0.2em] uppercase border border-black/15 dark:border-white/15 px-8 py-4 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white transition-all duration-300 cursor-pointer"
            >
              CLOSE CASE STUDY
            </button>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-[0.2em] uppercase bg-black dark:bg-white text-white dark:text-black px-8 py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>LAUNCH LIVE DEMO</span>
                <ArrowRight size={12} />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
