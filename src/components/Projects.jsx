import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { fetchApi } from "@/utils/api";
import CaseStudyModal from "./CaseStudyModal";
import "../styles/Projects.css";

const DEFAULT_PROJECTS = [
  {
    _id: "p1",
    num: "01",
    title: "PUNTO PAGO ECOSYSTEM",
    description: "BUILDING A CONNECTED ECOSYSTEM WHERE DISCOVERING, LEARNING AND BUYING DIGITAL FINANCIAL SERVICES FEELS EFFORTLESS.",
    image: "/project4.png",
    stack: ["REACT", "TAILWIND", "FINTECH API"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "LEAD UI/UX DESIGNER & ENGINEER",
    duration: "3 MONTHS (Q2 2025)",
    outcome: "+55% ACTIVE USER ENGAGEMENT"
  },
  {
    _id: "p2",
    num: "02",
    title: "VERDANT REAL ESTATE",
    description: "BUILDING A COMPLETE LUXURY REAL ESTATE BRAND, HIGH-RISE ARCHITECTURAL PRESENTATION, AND DIGITAL EXPERIENCE.",
    image: "/project2.png",
    stack: ["NEXT.JS", "FRAMER MOTION", "THREE.JS"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "UI/UX DESIGNER & DEV",
    duration: "2 MONTHS (Q4 2025)",
    outcome: "+40% PROPERTY INQUIRY CONVERSION"
  },
  {
    _id: "p3",
    num: "03",
    title: "ZOUTE LUXURY FASHION",
    description: "A MINIMALIST E-COMMERCE STOREFRONT FOR A HIGH-END FASHION HOUSE WITH HIGH-ACCURACY TYPOGRAPHIC COMPOSITION.",
    image: "/project1.png",
    stack: ["REACT", "TAILWIND", "FRAMER MOTION"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "LEAD FRONTEND ENGINEER",
    duration: "3 MONTHS (Q1 2026)",
    outcome: "+45% COLLECTION DWELL TIME"
  },
  {
    _id: "p4",
    num: "04",
    title: "SCRIBE AI WORKSPACE",
    description: "AN ADVANCED CHAT PLAYGROUND DASHBOARD FOR AI PROMPT ENGINEERING WITH DYNAMIC MARKDOWN PARSING AND SPLIT VIEWS.",
    image: "/project3.png",
    stack: ["REACT", "TYPESCRIPT", "OPENAI"],
    demo: "https://demo.example.com",
    github: "https://github.com",
    role: "FULL-STACK UX ENGINEER",
    duration: "4 MONTHS (Q2 2026)",
    outcome: "FLUID MULTI-VIEW SPLIT PANES"
  }
];

export default function Projects({ initialProjects }) {
  const [projectsList, setProjectsList] = useState(initialProjects || DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!initialProjects) {
      fetchApi("/projects")
        .then(res => {
          if (res.data && res.data.length > 0) {
            setProjectsList(res.data);
          }
        })
        .catch(() => {});
    }
  }, [initialProjects]);

  const leftColumnProjects = projectsList.filter((_, idx) => idx % 2 === 0);
  const rightColumnProjects = projectsList.filter((_, idx) => idx % 2 === 1);

  const renderProjectCard = (project, idx) => (
    <motion.div
      key={project._id || idx}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer mb-16 md:mb-20 flex flex-col select-none"
    >
      {/* Sharp Corner Image Card (No Border Radius) with Corner Frame Brackets & Hover Action Overlay */}
      <div 
        className="relative w-full aspect-[4/5] rounded-none overflow-hidden bg-zinc-900 border border-black/10 dark:border-white/10 shadow-2xl mb-6 cursor-pointer"
        onClick={() => setSelectedProject(project)}
      >
        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Corner Line Brackets (Frame Marks) */}
        <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-white z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-white z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-white z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-white z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Project Number Pill Badge */}
        <div className="absolute top-4 left-4 bg-zinc-900/90 text-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[10px] font-bold tracking-[0.2em] uppercase z-20 shadow-md">
          PROJECT {project.num || `0${idx + 1}`}
        </div>

        {/* Hover Action Overlay with Minimalist Line Buttons */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center gap-3 z-30 p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(project);
            }}
            className="px-6 py-3 border border-white bg-white/10 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg w-full max-w-[210px]"
          >
            <span>VIEW CASE STUDY</span>
            <ArrowUpRight size={14} />
          </button>

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-3 border border-white/40 bg-black/40 text-white text-xs font-bold tracking-[0.2em] uppercase hover:border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full max-w-[210px]"
            >
              <span>LIVE DEMO</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Content & Headings underneath matching website theme colors */}
      <div 
        className="flex flex-col cursor-pointer mt-1"
        onClick={() => setSelectedProject(project)}
      >
        {/* Subheading tag line (Muted theme zinc color matching website theme) */}
        <div className="text-xs font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mb-1.5">
          {Array.isArray(project.stack) ? project.stack.slice(0, 3).join(" • ") : (project.category || "UI/UX • FRONTEND")}
        </div>

        {/* Main Heading Title (Theme high-contrast text color) */}
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white group-hover:opacity-75 transition-opacity">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );

  return (
    <section id="projects" className="projects-section">
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
        {/* Section Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase block mb-3">
              03 / SELECTION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white uppercase tracking-tight flex items-center gap-3">
              <span>Selected work</span>
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-sm">
            A curated selection of 4 digital products, editorial platforms, and full-stack web applications.
          </p>
        </motion.div>

        {/* 2-Column Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Column (Items 0, 2) */}
          <div className="flex flex-col">
            {leftColumnProjects.map((project, idx) => renderProjectCard(project, idx * 2))}
          </div>

          {/* Right Column (Items 1, 3) - Offset Downward for Staggered Rhythm */}
          <div className="flex flex-col md:pt-16 lg:pt-24">
            {rightColumnProjects.map((project, idx) => renderProjectCard(project, idx * 2 + 1))}
          </div>
        </div>
      </div>

      {/* Case Study Details Modal */}
      {selectedProject && (
        <CaseStudyModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
}
