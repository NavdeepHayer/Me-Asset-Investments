import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PageFlowLine() {
  const [lineStyle, setLineStyle] = useState<{ top: number; height: number } | null>(null);

  const { scrollYProgress } = useScroll();

  // Calculate line dimensions
  useEffect(() => {
    const calculate = () => {
      const heroEl = document.querySelector('[data-hero]') as HTMLElement;
      const skylineEl = document.querySelector('[data-graphic="skyline"]') as HTMLElement;

      if (!heroEl || !skylineEl) {
        console.log('Missing elements:', { heroEl: !!heroEl, skylineEl: !!skylineEl });
        return;
      }

      // Get positions relative to document
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;

      // Walk up the DOM to get true offset for skyline
      let skylineTop = 0;
      let el: HTMLElement | null = skylineEl;
      while (el) {
        skylineTop += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
      const skylineBottom = skylineTop + skylineEl.offsetHeight;

      setLineStyle({
        top: heroBottom,
        height: skylineBottom - heroBottom
      });
    };

    // Multiple attempts to ensure DOM is fully rendered
    calculate();
    const t1 = setTimeout(calculate, 200);
    const t2 = setTimeout(calculate, 600);
    const t3 = setTimeout(calculate, 1200);

    window.addEventListener('resize', calculate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', calculate);
    };
  }, []);

  // Animated line draws as you scroll
  const pathLength = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);

  if (!lineStyle || lineStyle.height <= 0) return null;

  return (
    <>
      {/* Static background line - ALWAYS visible, never breaks */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          zIndex: 2
        }}
      />

      {/* Animated portion that draws as you scroll */}
      <motion.div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          height: '100vh',
          width: '2px',
          zIndex: 2
        }}
      >
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 2 100"
          style={{ overflow: 'visible' }}
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
