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
    // Multiple recalculations to catch late-rendering elements on mobile
    const t1 = setTimeout(calculate, 100);
    const t2 = setTimeout(calculate, 500);
    const t3 = setTimeout(calculate, 1000);
    const t4 = setTimeout(calculate, 2000);

    window.addEventListener('resize', calculate);
    window.addEventListener('orientationchange', calculate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', calculate);
      window.removeEventListener('orientationchange', calculate);
    };
  }, [calculate]);

  // Animated segments - draw as you scroll
  // Each connecting line starts AFTER the previous graphic's internal flow completes
  const heroToCrane = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, [0.18, 0.24], [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, [0.38, 0.44], [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, [0.58, 0.64], [0, 1]);

  if (!positions || positions.graphics.length < 4) return null;

  const { heroBottom, pageCenter, documentHeight, graphics } = positions;
  const [crane, blueprint, framework, skyline] = graphics;

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
        {/* Glow filter for flow lines */}
        <defs>
          <filter id="glow-flow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Hero to Crane */}
        <motion.line
          x1={pageCenter} y1={heroBottom}
          x2={crane.centerX} y2={crane.top}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-flow)"
          style={{ pathLength: heroToCrane }}
        />

        {/* Crane to Blueprint */}
        <motion.line
          x1={crane.centerX} y1={crane.bottom}
          x2={blueprint.centerX} y2={blueprint.top}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-flow)"
          style={{ pathLength: craneToBlueprint }}
        />

        {/* Blueprint to Framework */}
        <motion.line
          x1={blueprint.centerX} y1={blueprint.bottom}
          x2={framework.centerX} y2={framework.top}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-flow)"
          style={{ pathLength: blueprintToFramework }}
        />

        {/* Framework to Skyline */}
        <motion.line
          x1={framework.centerX} y1={framework.bottom}
          x2={skyline.centerX} y2={skyline.top}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-flow)"
          style={{ pathLength: frameworkToSkyline }}
        />
      </svg>
    </>
  );
}
