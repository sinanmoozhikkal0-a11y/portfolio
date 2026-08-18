import { useState, useEffect } from "react";
import { useTransition } from "@/context/TransitionContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "../styles/Header.css";

export default function Header() {
  const { isIntroActive } = useTransition();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position to update active nav link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "PROJECTS", href: "#projects" },
    { label: "SERVICES & SKILLS", href: "#skills" },
  ];

  return (
    <div className={`navbar-container ${isIntroActive ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-800"}`}>
      <nav className="navbar">
        {/* Left Side: Logo */}
        <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="navbar-logo">
          SINAN
        </a>

        {/* Center: Navigation Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`navbar-link ${activeSection === link.href.slice(1) ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side: Theme toggle & CTA */}
        <div className="navbar-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="navbar-cta-button"
          >
            LET'S TALK
          </a>
        </div>
      </nav>
    </div>
  );
}
