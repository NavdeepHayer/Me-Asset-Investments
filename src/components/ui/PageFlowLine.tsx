import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function PageFlowLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [skylineBottom, setSkylineBottom] = useState(0.85); // Default to 85% of page

  const { scrollYProgress } = useScroll();

  // Calculate where the skyline section ends (as a percentage of total page height)
  useEffect(() => {
    const calculateSkylinePosition = () => {
      const skylineEl = document.querySelector('[data-graphic="skyline"]');
      if (skylineEl) {
        const rect = skylineEl.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const skylineEndY = scrollTop + rect.bottom;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        setSkylineBottom(Math.min(skylineEndY / (totalHeight + window.innerHeight), 1));
      }
    };

    calculateSkylinePosition();
    window.addEventListener('resize', calculateSkylinePosition);
    // Recalculate after content loads
    const timer = setTimeout(calculateSkylinePosition, 500);

    return () => {
      window.removeEventListener('resize', calculateSkylinePosition);
      clearTimeout(timer);
    };
  }, []);

  // Line draws from 0 to skylineBottom of scroll progress
  const pathLength = useTransform(
    scrollYProgress,
    [0, skylineBottom],
    [0, 1]
  );

  // Line opacity - fade in, stay visible, then stays at skyline
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, skylineBottom - 0.05, skylineBottom],
    [0, 0.12, 0.12, 0.08]
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 lg:hidden"
      style={{ height: `${skylineBottom * 100}vh` }}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {/* Single vertical line that flows through the center of the page */}
        <motion.line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="rgba(255,255,255,1)"
          strokeWidth="0.15"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
        />
      </svg>
    </div>
  );
}
