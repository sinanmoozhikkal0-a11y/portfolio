import React, { useMemo } from "react";
import "../styles/Marquee.css";

export default function Marquee({ text, speed = 25, className = "" }) {
  const segments = useMemo(() => {
    if (Array.isArray(text)) return text;
    return text.split(" • ");
  }, [text]);

  // Duplicate segments to guarantee continuous scroll coverage
  const items = useMemo(() => {
    return [...segments, ...segments, ...segments, ...segments];
  }, [segments]);

  return (
    <div className={`marquee-container ${className}`}>
      <div className="marquee-content" style={{ animationDuration: `${speed}s` }}>
        {items.map((item, idx) => (
          <div key={idx} className="marquee-chip">
            <span className="marquee-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="marquee-content" style={{ animationDuration: `${speed}s` }} aria-hidden="true">
        {items.map((item, idx) => (
          <div key={idx} className="marquee-chip">
            <span className="marquee-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
