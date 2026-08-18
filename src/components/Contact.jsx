import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Send, ArrowUpRight, Check, AlertCircle } from "lucide-react";
import { fetchApi } from "@/utils/api";
import "../styles/Contact.css";

// Reusable Magnetic Button wrapper using spring dynamics (Awwwards/Cuberto style)
function MagneticLink({ children, href, className, onClick, type }) {
  const buttonRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (onClick || type === "submit") {
    return (
      <div className="magnetic-btn-wrap w-full">
        <motion.button
          ref={buttonRef}
          type={type}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ x: springX, y: springY }}
          className={`${className} cursor-pointer border-0 outline-none`}
        >
          {children}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="magnetic-btn-wrap">
      <motion.a
        ref={buttonRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className={className}
      >
        {children}
      </motion.a>
    </div>
  );
}

const socials = [
  { label: "GITHUB", url: "https://github.com" },
  { label: "LINKEDIN", url: "https://linkedin.com" },
  { label: "INSTAGRAM", url: "https://instagram.com" },
];

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [focusedInput, setFocusedInput] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("sending");
    
    try {
      await fetchApi("/contact", {
        method: "POST",
        body: JSON.stringify(formState)
      });
      setSubmitStatus("success");
      setFormState({ name: "", email: "", message: "" });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error("Failed to send contact message:", err);
      setSubmitStatus("error");
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const formFadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1,
      },
    },
  };

  return (
    <section id="contact" className="contact-page-container select-none relative w-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-400 overflow-hidden py-20">
      
      {/* Background Subtle Spotlight Lighting Glow */}
      <div 
        className="absolute bottom-[-10vmax] right-[-10vmax] pointer-events-none z-0"
        style={{
          width: "50vmax",
          height: "50vmax",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(127, 127, 127, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        
        {/* Left Column: Visual Typography Info */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center h-full max-w-xl">
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="contact-massive-heading text-black dark:text-white select-none uppercase"
          >
            LET'S BUILD <span className="bold-text">SOMETHING</span> BEAUTIFUL.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 text-sm md:text-base font-normal leading-relaxed mt-6 mb-6 uppercase tracking-wider"
          >
            I AM CURRENTLY OPEN TO CONTRACT ROLES, VISUAL DESIGN AND FRONTEND SPRINTS, AND DIGITAL SYSTEM AUDITS.
          </motion.p>

          {/* Minimal Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="contact-socials-grid"
          >
            {socials.map((social, idx) => (
              <MagneticLink
                key={idx}
                href={social.url}
                className="contact-pill-link"
              >
                <span>{social.label}</span>
                <ArrowUpRight size={10} />
              </MagneticLink>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Premium Interactive Form */}
        <motion.div
          variants={formFadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="col-span-1 md:col-span-6 flex flex-col w-full h-full justify-center pt-8 md:pt-0"
        >
          <form onSubmit={handleFormSubmit} className="flex flex-col w-full">
            
            {/* Name Input */}
            <div className={`apple-input-wrapper ${focusedInput === "name" ? "focused" : ""} ${formState.name ? "has-value" : ""}`}>
              <label className="apple-label">YOUR NAME</label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                onChange={handleInputChange}
                className="apple-input"
                required
              />
              <div className="apple-input-focus-line" />
            </div>

            {/* Email Input */}
            <div className={`apple-input-wrapper ${focusedInput === "email" ? "focused" : ""} ${formState.email ? "has-value" : ""}`}>
              <label className="apple-label">EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                onChange={handleInputChange}
                className="apple-input"
                required
              />
              <div className="apple-input-focus-line" />
            </div>

            {/* Message Input */}
            <div className={`apple-input-wrapper ${focusedInput === "message" ? "focused" : ""} ${formState.message ? "has-value" : ""}`}>
              <label className="apple-label">TELL ME ABOUT YOUR PROJECT SCOPE</label>
              <textarea
                name="message"
                value={formState.message}
                onFocus={() => setFocusedInput("message")}
                onBlur={() => setFocusedInput(null)}
                onChange={handleInputChange}
                className="apple-input resize-none"
                rows={4}
                required
              />
              <div className="apple-input-focus-line" />
            </div>

            {/* Status alerts */}
            {submitStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-white font-semibold text-xs mb-6 tracking-wider uppercase"
              >
                <Check size={14} className="text-emerald-400" />
                <span>MESSAGE SENT SUCCESSFULLY! I WILL CORRESPOND SHORTLY.</span>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-white font-semibold text-xs mb-6 tracking-wider uppercase"
              >
                <AlertCircle size={14} className="text-rose-400" />
                <span>PLEASE FILL IN ALL INPUTS TO INITIATE A TRANSMISSION.</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <MagneticLink
              type="submit"
              className="apple-submit-btn"
            >
              <span>{submitStatus === "sending" ? "TRANSMITTING..." : "SEND MESSAGE"}</span>
              <Send size={12} />
            </MagneticLink>

          </form>
        </motion.div>

      </div>
    </section>
  );
}
