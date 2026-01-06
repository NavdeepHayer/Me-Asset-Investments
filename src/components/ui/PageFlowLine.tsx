import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PageFlowLine() {
  const [lineHeight, setLineHeight] = useState(0);
  const [heroBottom, setHeroBottom] = useState(0);
  const [isReady, setIsReady] = useState(false);

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

  // Delay showing the line until after hero animation completes (2.5s)
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Line draws based on scroll progress
  // Start drawing after hero and complete by skyline
  const pathLength = useTransform(
    scrollYProgress,
    [0.02, 0.85],
    [0, 1]
  );

  // Line is always visible at consistent opacity - never breaks
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.85, 0.95],
    [0.12, 0.12, 0.12, 0.08]
  );

  if (lineHeight <= 0 || !isReady) return null;

  return (
    <motion.div
      className="fixed left-1/2 -translate-x-1/2 pointer-events-none z-0"
      style={{
        top: heroBottom,
        height: lineHeight,
        width: '1px'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1 100"
      >
        {/* Background line - always visible, provides continuity */}
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Animated line - draws as you scroll */}
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
    </motion.div>
  );
}
