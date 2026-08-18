"use client";

import { useEffect, useRef } from "react";

export default function Particles({ count = 35, color = "rgba(255, 255, 255, 0.15)", minSize = 0.6, maxSize = 1.6, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particlesArray = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = -Math.random() * 0.25 - 0.05; // Float upwards slowly
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.01 + 0.003;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap edges
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
        if (this.x < -10 || this.x > width + 10) {
          this.x = Math.random() * width;
        }

        // Slow opacity pulse
        this.opacity += this.pulseSpeed;
        if (this.opacity > 0.55 || this.opacity < 0.08) {
          this.pulseSpeed = -this.pulseSpeed;
        }
      }

      draw() {
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, color, minSize, maxSize]);

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-[0] ${className}`} />;
}
