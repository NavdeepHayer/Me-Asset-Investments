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
    // Recalculate multiple times to ensure correct positioning after layout
    const timer1 = setTimeout(calculatePositions, 100);
    const timer2 = setTimeout(calculatePositions, 500);
    const timer3 = setTimeout(calculatePositions, 1000);

    return () => {
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Line draws based on scroll progress
  const pathLength = useTransform(
    scrollYProgress,
    [0.02, 0.85],
    [0, 1]
  );

  if (lineHeight <= 0) return null;

  return (
    <motion.div
      className="fixed left-1/2 -translate-x-1/2 pointer-events-none z-0"
      style={{
        top: heroBottom,
        height: lineHeight,
        width: '2px'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 3.2 }}
    >
      {/* Background line - always visible, provides continuity */}
      <div
        className="absolute inset-0 bg-white/10"
        style={{ width: '1px', left: '50%', transform: 'translateX(-50%)' }}
      />

      {/* Animated line overlay - draws as you scroll */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
      >
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </motion.div>
  );
}
