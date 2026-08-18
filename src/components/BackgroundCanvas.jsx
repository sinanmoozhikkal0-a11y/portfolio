"use client";

import { useEffect, useState, useRef } from "react";


const BACKGROUNDS = [
  { id: "home", src: "/bw_hero.png" },
  { id: "about", src: "/bw_about.png" },
  { id: "skills", src: "/bw_skills.png" },
  { id: "projects", src: "/bw_projects.png" },
  { id: "contact", src: "/bw_contact.png" },
];

export default function BackgroundCanvas() {
  const [activeSection, setActiveSection] = useState("home");
  
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);
  const windowHeightRef = useRef(800);

  const bgWrapperRef = useRef(null);
  const radialGlowRef = useRef(null);

  // Mouse interactivity parallax coordinate tracker
  useEffect(() => {
    if (typeof window === "undefined") return;

    windowHeightRef.current = window.innerHeight;
    scrollYRef.current = window.scrollY;

    const handleMouseMove = (e) => {
      // Calculate offset percentage from center (-25px to 25px shift range)
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      targetOffsetRef.current = { x, y };
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleResize = () => {
      windowHeightRef.current = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Smooth ease interpolation (lerp) for mouse coordinates
  useEffect(() => {
    let animId;
    const updateLerp = () => {
      const targetX = targetOffsetRef.current.x;
      const targetY = targetOffsetRef.current.y;
      
      const prevX = mouseOffsetRef.current.x;
      const prevY = mouseOffsetRef.current.y;
      
      const dx = targetX - prevX;
      const dy = targetY - prevY;
      
      const newX = prevX + dx * 0.06; // slow drift
      const newY = prevY + dy * 0.06;
      
      mouseOffsetRef.current = { x: newX, y: newY };
      
      // Update DOM styles directly!
      if (bgWrapperRef.current) {
        bgWrapperRef.current.style.transform = `translate3d(${newX * 0.5}px, ${newY * 0.5 - scrollYRef.current * 0.05}px, 0)`;
      }
      
      if (radialGlowRef.current) {
        const glowScrollY = (scrollYRef.current * 0.1) % windowHeightRef.current;
        radialGlowRef.current.style.transform = `translate3d(${newX * 1.5}px, ${newY * 1.5 - glowScrollY}px, 0)`;
      }
      
      animId = requestAnimationFrame(updateLerp);
    };
    animId = requestAnimationFrame(updateLerp);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Scroll observer to update active background watermark images
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section is focused on screen center
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      {/* Background container wrapper with parallax translations */}
      <div 
        ref={bgWrapperRef}
        className="bg-image-wrapper"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -15,
          pointerEvents: "none",
        }}
      >
        {BACKGROUNDS.map((bg, idx) => {
          const isActive = activeSection === bg.id;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transition: "opacity 1.5s ease-in-out",
                opacity: isActive ? 0.16 : 0,
                zIndex: isActive ? -10 : -20,
              }}
            >
              <img
                src={bg.src}
                alt="B&W Art Background"
                className="w-full h-full object-cover bg-image-content"
                style={{
                  opacity: 1
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Interactive Slow Moving Radial Light Pool (Awwwards Style) */}
      <div
        ref={radialGlowRef}
        className="fixed pointer-events-none z-[-8]"
        style={{
          width: "200vw",
          height: "200vh",
          left: "-50vw",
          top: "-50vh",
          background: "radial-gradient(circle 50vw, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
      
      {/* A canvas overlay color gradient matching the theme */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-95" 
        style={{ zIndex: -9 }}
      />
    </>
  );
}
