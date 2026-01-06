import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PageFlowLine() {
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);

  const { scrollYProgress } = useScroll();

  // Calculate start (hero bottom) and end (skyline bottom) positions
  useEffect(() => {
    const calculatePositions = () => {
      const heroEl = document.querySelector('section');
      const skylineEl = document.querySelector('[data-graphic="skyline"]');

      if (heroEl) {
        // Start at bottom of hero
        setStartY(heroEl.offsetHeight);
      }

      if (skylineEl) {
        // End at bottom of skyline
        const rect = skylineEl.getBoundingClientRect();
        const scrollTop = window.scrollY;
        setEndY(scrollTop + rect.bottom);
      }
    };

    // Calculate after a short delay to ensure DOM is ready
    const timer = setTimeout(calculatePositions, 100);
    calculatePositions();

    window.addEventListener('resize', calculatePositions);
    window.addEventListener('scroll', calculatePositions, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePositions);
      window.removeEventListener('scroll', calculatePositions);
    };
  }, []);

  // Line draws as you scroll
  const pathLength = useTransform(scrollYProgress, [0.05, 0.8], [0, 1]);

  const lineHeight = endY - startY;
  if (lineHeight <= 0) return null;

  return (
    <>
      {/* Static background line - ALWAYS visible, never breaks */}
      <div
        className="fixed left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: startY,
          height: lineHeight,
          width: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          zIndex: 1
        }}
      />

      {/* Animated line that draws on scroll */}
      <motion.div
        className="fixed left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden"
        style={{
          top: startY,
          height: lineHeight,
          width: '2px',
          zIndex: 1
        }}
      >
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 2 100"
        >
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
      </motion.div>
    </>
  );
}
