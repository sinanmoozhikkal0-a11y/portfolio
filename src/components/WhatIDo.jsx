import React from "react";
import { motion } from "framer-motion";
import { PenTool, Code2, Smartphone, Check } from "lucide-react";
import "@/styles/WhatIDo.css";

const SERVICES = [
  {
    num: "01",
    icon: PenTool,
    title: "UI/UX DESIGN",
    description: "DESIGNING INTUITIVE AND ENGAGING INTERFACES THAT PROVIDE MEANINGFUL EXPERIENCES AND SOLVE REAL USER PROBLEMS.",
    skills: [
      "USER RESEARCH",
      "WIREFRAMING",
      "UI DESIGN",
      "PROTOTYPING"
    ]
  },
  {
    num: "02",
    icon: Code2,
    title: "FRONTEND DEVELOPMENT",
    description: "BUILDING FAST, RESPONSIVE AND SCALABLE WEBSITES USING MODERN TECHNOLOGIES AND BEST PRACTICES.",
    skills: [
      "REACT DEVELOPMENT",
      "RESPONSIVE DESIGN",
      "CLEAN & SCALABLE CODE"
    ]
  },
  {
    num: "03",
    icon: Smartphone,
    title: "MOBILE APP DESIGN",
    description: "DESIGNING RESPONSIVE, INTUITIVE, AND MODERN MOBILE APP INTERFACES FOR IOS AND ANDROID PLATFORMS.",
    skills: [
      "IOS & ANDROID DESIGN",
      "MOBILE UI KITS",
      "APP PROTOTYPING",
      "USER FLOW MAPPING"
    ]
  }
];

export default function WhatIDo() {
  return (
    <section id="what-i-do" className="what-i-do-section">
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase block mb-3">
            02 / SERVICES
          </span>
          <h2 className="section-heading">WHAT I DO</h2>
        </motion.div>

        {/* 3 Services Cards Grid */}
        <div className="services-grid">
          {SERVICES.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="service-card"
              >
                <div>
                  {/* Header: Dot + Number & Icon */}
                  <div className="service-card-header">
                    <div className="service-number-wrap">
                      <span className="service-dot" />
                      <span className="service-number">{service.num}</span>
                    </div>
                    <div className="service-icon-wrap">
                      <IconComponent size={28} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title & Underline */}
                  <h3 className="service-title">{service.title}</h3>
                  <div className="service-title-line" />

                  {/* Description */}
                  <p className="service-desc">{service.description}</p>

                  {/* Checklist */}
                  <div className="service-checklist">
                    {service.skills.map((skill, i) => (
                      <div key={i} className="service-check-item">
                        <Check size={14} className="check-icon" strokeWidth={2.5} />
                        <span>{skill}</span>
                      </div>
                    ))}
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
