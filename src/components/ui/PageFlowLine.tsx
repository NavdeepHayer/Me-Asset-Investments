import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface GraphicPosition {
  id: string;
  centerX: number;
  top: number;
  bottom: number;
}

export function PageFlowLine() {
  const [positions, setPositions] = useState<{
    heroBottom: number;
    pageCenter: number;
    documentHeight: number;
    graphics: GraphicPosition[];
  } | null>(null);

  const { scrollYProgress } = useScroll();

  // Calculate positions of all graphics
  const calculate = useCallback(() => {
    const heroEl = document.querySelector('[data-hero]') as HTMLElement;
    if (!heroEl) return;

    const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
    const pageCenter = window.innerWidth / 2;
    const documentHeight = document.documentElement.scrollHeight;

    // Find all graphics in order
    const graphicIds = ['crane', 'blueprint', 'framework', 'skyline'];
    const graphics: GraphicPosition[] = [];

    graphicIds.forEach(id => {
      const el = document.querySelector(`[data-graphic="${id}"]`) as HTMLElement;
      if (!el) return;

      // Get true vertical position by walking up the DOM
      let offsetTop = 0;
      let current: HTMLElement | null = el;
      while (current) {
        offsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Get horizontal center - rect gives viewport coords, add scrollX to get document coords
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2 + window.scrollX;

      graphics.push({
        id,
        centerX: elCenterX,
        top: offsetTop,
        bottom: offsetTop + el.offsetHeight
      });
    });

    setPositions({
      heroBottom,
      pageCenter,
      documentHeight,
      graphics
    });
  }, []);

  useEffect(() => {
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
  }, [calculate]);

  // Animated segments for each connection
  const heroToCrane = useTransform(scrollYProgress, [0.02, 0.10], [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, [0.15, 0.28], [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, [0.32, 0.45], [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, [0.50, 0.62], [0, 1]);

  if (!positions || positions.graphics.length < 4) return null;

  const { heroBottom, pageCenter, documentHeight, graphics } = positions;
  const [crane, blueprint, framework, skyline] = graphics;

  return (
    <>
      {/* SVG overlay for connecting paths - BEHIND text content (z-index: 0) */}
      <svg
        className="pointer-events-none absolute left-0 top-0"
        style={{
          width: '100%',
          height: documentHeight,
          zIndex: 0
        }}
        preserveAspectRatio="none"
      >
        {/* Static faint connecting lines for visual continuity - drawn first (behind) */}
        <path
          d={`M ${pageCenter} ${heroBottom}
              Q ${pageCenter + (crane.centerX - pageCenter) * 0.5} ${heroBottom + (crane.top - heroBottom) * 0.5}
                ${crane.centerX} ${crane.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />
        <path
          d={`M ${crane.centerX} ${crane.bottom}
              C ${crane.centerX} ${crane.bottom + 80}
                ${blueprint.centerX} ${blueprint.top - 80}
                ${blueprint.centerX} ${blueprint.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />
        <path
          d={`M ${blueprint.centerX} ${blueprint.bottom}
              C ${blueprint.centerX} ${blueprint.bottom + 80}
                ${framework.centerX} ${framework.top - 80}
                ${framework.centerX} ${framework.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />
        <path
          d={`M ${framework.centerX} ${framework.bottom}
              C ${framework.centerX} ${framework.bottom + 80}
                ${skyline.centerX} ${skyline.top - 80}
                ${skyline.centerX} ${skyline.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />

        {/* Animated paths - draw on scroll */}
        {/* Hero to Crane - diagonal from center to graphic */}
        <motion.path
          d={`M ${pageCenter} ${heroBottom}
              Q ${pageCenter + (crane.centerX - pageCenter) * 0.5} ${heroBottom + (crane.top - heroBottom) * 0.5}
                ${crane.centerX} ${crane.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: heroToCrane }}
        />

        {/* Crane to Blueprint - curves across */}
        <motion.path
          d={`M ${crane.centerX} ${crane.bottom}
              C ${crane.centerX} ${crane.bottom + 80}
                ${blueprint.centerX} ${blueprint.top - 80}
                ${blueprint.centerX} ${blueprint.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: craneToBlueprint }}
        />

        {/* Blueprint to Framework - curves across */}
        <motion.path
          d={`M ${blueprint.centerX} ${blueprint.bottom}
              C ${blueprint.centerX} ${blueprint.bottom + 80}
                ${framework.centerX} ${framework.top - 80}
                ${framework.centerX} ${framework.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: blueprintToFramework }}
        />

        {/* Framework to Skyline */}
        <motion.path
          d={`M ${framework.centerX} ${framework.bottom}
              C ${framework.centerX} ${framework.bottom + 80}
                ${skyline.centerX} ${skyline.top - 80}
                ${skyline.centerX} ${skyline.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: frameworkToSkyline }}
        />
      </svg>
    </>
  );
}
