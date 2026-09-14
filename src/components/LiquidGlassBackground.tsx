"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function LiquidGlassBackground() {
  const [mounted, setMounted] = useState(false);
  
  // Mouse tracking with physics (springs)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    // Set initial position to center of screen
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#0a0a0c]">
      {/* 
        The SVG filter definition for the "gooey" liquid effect.
        This uses color matrix math to increase contrast on the alpha channel,
        which mathematically merges blurred shapes together.
      */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-glass">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 60 -30
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* The Liquid Container - This applies the filter to its children */}
      <div 
        className="absolute inset-0 w-full h-full opacity-70"
        style={{ filter: "url('#gooey-glass')" }}
      >
        {/* Floating Background Blobs (Slow moving, ambient) */}
        <motion.div
          animate={{
            x: ["0vw", "30vw", "-20vw", "0vw"],
            y: ["0vh", "-20vh", "30vh", "0vh"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mix-blend-screen"
        />

        <motion.div
          animate={{
            x: ["0vw", "-30vw", "20vw", "0vw"],
            y: ["0vh", "40vh", "-10vh", "0vh"],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-pink-500 to-rose-400 rounded-full mix-blend-screen"
        />

        <motion.div
          animate={{
            x: ["0vw", "40vw", "-10vw", "0vw"],
            y: ["0vh", "-30vh", "20vh", "0vh"],
            scale: [0.9, 1.4, 1.1, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] bg-gradient-to-tr from-sky-400 to-cyan-300 rounded-full mix-blend-screen"
        />

        {/* Physics-driven Blob tracking the cursor */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-[#F5C518] to-amber-400 rounded-full mix-blend-screen"
        />
      </div>

      {/* Frosted Glass Overlay (iOS Style) */}
      <div className="absolute inset-0 w-full h-full backdrop-blur-[60px] bg-[#0a0a0c]/40" />
      
      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
    </div>
  );
}
