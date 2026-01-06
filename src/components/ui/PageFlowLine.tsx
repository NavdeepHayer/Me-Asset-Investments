import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PageFlowLine() {
  const [lineHeight, setLineHeight] = useState(0);
  const [heroBottom, setHeroBottom] = useState(0);

  const { scrollYProgress } = useScroll();

  // Calculate positions
  useEffect(() => {
    const calculatePositions = () => {
      // Find hero section (first section)
      const heroEl = document.querySelector('section');
      const skylineEl = document.querySelector('[data-graphic="skyline"]');

      if (heroEl) {
        setHeroBottom(heroEl.offsetHeight);
      }

      if (skylineEl) {
        const rect = skylineEl.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const skylineEndY = scrollTop + rect.bottom;
        // Line height from hero bottom to skyline bottom
        setLineHeight(skylineEndY - (heroEl?.offsetHeight || 0));
      }
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    const timer = setTimeout(calculatePositions, 500);

    return () => {
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(timer);
    };
  }, []);

  // Line draws based on scroll progress
  // Start drawing after hero (around 10% scroll) and complete by skyline
  const pathLength = useTransform(
    scrollYProgress,
    [0.05, 0.85],
    [0, 1]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.8, 0.9],
    [0.15, 0.15, 0.12, 0.08]
  );

  if (lineHeight <= 0) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 pointer-events-none z-0"
      style={{
        top: heroBottom,
        height: lineHeight,
        width: '1px'
      }}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1 100"
      >
        <motion.line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke="rgba(255,255,255,1)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
        />
      </svg>
    </div>
  );
}
