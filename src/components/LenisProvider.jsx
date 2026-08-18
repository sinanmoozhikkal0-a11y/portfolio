import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider() {
  const pathname = "/";

  useEffect(() => {
    // Initialize Lenis scroll options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium slow ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Sync Lenis with requestAnimationFrame
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth scroll sync for URL hashes on page loads (e.g. going from /contact to /#about)
  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;

    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      
      // Delay slightly to let the route mount and transition curtain clear
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
