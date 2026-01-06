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

      // Get horizontal center
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

  // Animated segments - smoother timing
  const heroToCrane = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, [0.14, 0.24], [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, [0.30, 0.42], [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);

  if (!positions || positions.graphics.length < 4) return null;

  const { heroBottom, pageCenter, documentHeight, graphics } = positions;
  const [crane, blueprint, framework, skyline] = graphics;

  // Calculate smooth curve control points - more elegant sweeping curves
  const curveStrength = 120; // How much the curve bends

  return (
    <>
      {/* SVG overlay for connecting paths */}
      <svg
        className="pointer-events-none absolute left-0 top-0"
        style={{
          width: '100%',
          height: documentHeight,
          zIndex: 0
        }}
        preserveAspectRatio="none"
      >
        {/* Faint guide lines */}
        <path
          d={`M ${pageCenter} ${heroBottom}
              C ${pageCenter} ${heroBottom + curveStrength}
                ${crane.centerX} ${crane.top - curveStrength}
                ${crane.centerX} ${crane.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
        <path
          d={`M ${crane.centerX} ${crane.bottom}
              C ${crane.centerX} ${crane.bottom + curveStrength}
                ${blueprint.centerX} ${blueprint.top - curveStrength}
                ${blueprint.centerX} ${blueprint.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
        <path
          d={`M ${blueprint.centerX} ${blueprint.bottom}
              C ${blueprint.centerX} ${blueprint.bottom + curveStrength}
                ${framework.centerX} ${framework.top - curveStrength}
                ${framework.centerX} ${framework.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
        <path
          d={`M ${framework.centerX} ${framework.bottom}
              C ${framework.centerX} ${framework.bottom + curveStrength}
                ${skyline.centerX} ${skyline.top - curveStrength}
                ${skyline.centerX} ${skyline.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Animated paths */}
        <motion.path
          d={`M ${pageCenter} ${heroBottom}
              C ${pageCenter} ${heroBottom + curveStrength}
                ${crane.centerX} ${crane.top - curveStrength}
                ${crane.centerX} ${crane.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: heroToCrane }}
        />

        <motion.path
          d={`M ${crane.centerX} ${crane.bottom}
              C ${crane.centerX} ${crane.bottom + curveStrength}
                ${blueprint.centerX} ${blueprint.top - curveStrength}
                ${blueprint.centerX} ${blueprint.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: craneToBlueprint }}
        />

        <motion.path
          d={`M ${blueprint.centerX} ${blueprint.bottom}
              C ${blueprint.centerX} ${blueprint.bottom + curveStrength}
                ${framework.centerX} ${framework.top - curveStrength}
                ${framework.centerX} ${framework.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: blueprintToFramework }}
        />

        <motion.path
          d={`M ${framework.centerX} ${framework.bottom}
              C ${framework.centerX} ${framework.bottom + curveStrength}
                ${skyline.centerX} ${skyline.top - curveStrength}
                ${skyline.centerX} ${skyline.top}`}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: frameworkToSkyline }}
        />
      </svg>
    </>
  );
}
