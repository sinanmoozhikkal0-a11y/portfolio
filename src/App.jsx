import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientShell from "@/components/ClientShell";
import { TransitionProvider } from "@/context/TransitionContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

// Admin CMS Imports
import AdminLogin from "@/components/admin/AdminLogin";
import SettingsManager from "@/components/admin/SettingsManager";
import HeroManager from "@/components/admin/HeroManager";
import AboutManager from "@/components/admin/AboutManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import FooterManager from "@/components/admin/FooterManager";
import MediaManager from "@/components/admin/MediaManager";
import MessagesManager from "@/components/admin/MessagesManager";

function MainPortfolioView() {
  return (
    <>
      <ClientShell />
      <div className="noise-overlay" />
      <Header />
      <main className="relative z-10 w-full flex-grow">
        {/* 1. Hero Section */}
        <Hero />
        {/* 2. About Section */}
        <About />
        {/* 3. Project Section */}
        <Projects />
        {/* 4. Skills & Services Section */}
        <Skills />
        {/* 5. Contact Section */}
        <Contact />
      </main>
      {/* 6. Footer */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TransitionProvider>
        <Router>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<MainPortfolioView />} />

            {/* Admin Panel Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<SettingsManager />} />
            <Route path="/admin/hero" element={<HeroManager />} />
            <Route path="/admin/about" element={<AboutManager />} />
            <Route path="/admin/skills" element={<SkillsManager />} />
            <Route path="/admin/projects" element={<ProjectsManager />} />
            <Route path="/admin/footer" element={<FooterManager />} />
            <Route path="/admin/media" element={<MediaManager />} />
            <Route path="/admin/messages" element={<MessagesManager />} />
            <Route path="/admin/settings" element={<SettingsManager />} />
          </Routes>
        </Router>
      </TransitionProvider>
    </ThemeProvider>
  );
}
