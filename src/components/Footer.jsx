import { useState, useEffect } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { fetchApi } from "@/utils/api";

const DEFAULT_SOCIALS = [
  { platform: "GitHub", url: "https://github.com", isEnabled: true },
  { platform: "LinkedIn", url: "https://linkedin.com", isEnabled: true },
  { platform: "Instagram", url: "https://instagram.com", isEnabled: true }
];

export default function Footer({ initialFooter }) {
  const [year, setYear] = useState(2026);
  const [data, setData] = useState(initialFooter || {
    description: "CRAFTING INTUITIVE INTERFACES & PERFORMANCE ARCHITECTURES FROM SYSTEM TO SCREEN.",
    copyrightText: "SINAN M. ALL RIGHTS RESERVED. | MONOCHROME PORTFOLIO",
    socials: DEFAULT_SOCIALS
  });

  useEffect(() => {
    setYear(new Date().getFullYear());

    if (!initialFooter) {
      fetchApi("/footer")
        .then(res => {
          if (res.data) {
            setData(prev => ({
              ...prev,
              description: res.data.description || prev.description,
              copyrightText: res.data.copyrightText || prev.copyrightText,
              socials: (res.data.socials && res.data.socials.length > 0) ? res.data.socials : prev.socials
            }));
          }
        })
        .catch(() => {});
    }
  }, [initialFooter]);

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSocials = data.socials?.filter(s => s.isEnabled !== false) || [];

  return (
    <footer className="bg-white dark:bg-black border-t border-black/10 dark:border-white/10 py-12 md:py-16 z-10 relative transition-colors duration-400">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col space-y-12">
        
        {/* Upper Footer: Tagline & Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-4">
          <div className="max-w-md">
            <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 block mb-3 uppercase">
              STUDIO STATEMENT
            </span>
            <p className="text-sm font-semibold tracking-wider text-black dark:text-white leading-relaxed uppercase">
              {data.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {activeSocials.map((social, idx) => (
              <a
                key={idx}
                href={social.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-1 transition-colors"
              >
                <span>{social.platform}</span>
                <ArrowUpRight size={10} />
              </a>
            ))}
          </div>
        </div>

        {/* Lower Footer: Copyright & Scroll to Top */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-[10px] font-bold tracking-widest text-center sm:text-left uppercase">
            &copy; {year} {data.copyrightText}
          </p>

          <a
            href="#"
            onClick={handleScrollToTop}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all duration-300 group cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
