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

  // Animated segments - draw as you scroll
  const heroToCrane = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, [0.30, 0.38], [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, [0.48, 0.56], [0, 1]);

  if (!positions || positions.graphics.length < 4) return null;

  const { heroBottom, pageCenter, documentHeight, graphics } = positions;
  const [crane, blueprint, framework, skyline] = graphics;

  // Spread amount for diverging/converging lines
  const spread = 60;

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
        {/* Hero to Crane - 3 lines converging */}
        <motion.line
          x1={pageCenter - spread} y1={heroBottom}
          x2={crane.centerX} y2={crane.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: heroToCrane }}
        />
        <motion.line
          x1={pageCenter} y1={heroBottom}
          x2={crane.centerX} y2={crane.top}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: heroToCrane }}
        />
        <motion.line
          x1={pageCenter + spread} y1={heroBottom}
          x2={crane.centerX} y2={crane.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: heroToCrane }}
        />

        {/* Crane to Blueprint - diverge then converge */}
        <motion.line
          x1={crane.centerX} y1={crane.bottom}
          x2={blueprint.centerX - spread} y2={blueprint.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: craneToBlueprint }}
        />
        <motion.line
          x1={crane.centerX} y1={crane.bottom}
          x2={blueprint.centerX} y2={blueprint.top}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: craneToBlueprint }}
        />
        <motion.line
          x1={crane.centerX} y1={crane.bottom}
          x2={blueprint.centerX + spread} y2={blueprint.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: craneToBlueprint }}
        />

        {/* Blueprint to Framework - converge */}
        <motion.line
          x1={blueprint.centerX - spread} y1={blueprint.bottom}
          x2={framework.centerX} y2={framework.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: blueprintToFramework }}
        />
        <motion.line
          x1={blueprint.centerX} y1={blueprint.bottom}
          x2={framework.centerX} y2={framework.top}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: blueprintToFramework }}
        />
        <motion.line
          x1={blueprint.centerX + spread} y1={blueprint.bottom}
          x2={framework.centerX} y2={framework.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: blueprintToFramework }}
        />

        {/* Framework to Skyline - converge to center */}
        <motion.line
          x1={framework.centerX} y1={framework.bottom}
          x2={skyline.centerX - spread} y2={skyline.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: frameworkToSkyline }}
        />
        <motion.line
          x1={framework.centerX} y1={framework.bottom}
          x2={skyline.centerX} y2={skyline.top}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: frameworkToSkyline }}
        />
        <motion.line
          x1={framework.centerX} y1={framework.bottom}
          x2={skyline.centerX + spread} y2={skyline.top}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: frameworkToSkyline }}
        />
      </svg>
    </>
  );
}
