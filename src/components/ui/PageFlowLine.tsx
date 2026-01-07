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
    heroCenter: number;
    documentHeight: number;
    graphics: GraphicPosition[];
    isDesktop: boolean;
  } | null>(null);

  const { scrollYProgress } = useScroll();

  // Calculate positions of all graphics
  const calculate = useCallback(() => {
    const heroEl = document.querySelector('[data-hero]') as HTMLElement;
    if (!heroEl) return;

    // Get hero's center position (where the line ends) from the actual element
    const heroRect = heroEl.getBoundingClientRect();
    const heroCenter = heroRect.left + heroRect.width / 2 + window.scrollX;
    const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint

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
      heroCenter,
      documentHeight,
      graphics,
      isDesktop
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
  // Connecting lines should COMPLETE before the next graphic's internal flow starts
  const heroToCrane = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, [0.16, 0.22], [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, [0.56, 0.62], [0, 1]);

  if (!positions || positions.graphics.length < 4) return null;

  const { heroBottom, heroCenter, documentHeight, graphics, isDesktop } = positions;
  const [crane, blueprint, framework, skyline] = graphics;

  // Calculate turn points for 90° turns
  // Place horizontal segments CLOSE to destination graphic (90% down) to go BELOW text
  const heroToCraneTurnY = crane.top - 50; // Just above crane
  const craneToBlueprintTurnY = blueprint.top - 50; // Just above blueprint
  const blueprintToFrameworkTurnY = framework.top - 50; // Just above framework
  const frameworkToSkylineTurnY = skyline.top - 50; // Just above skyline

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

        {isDesktop ? (
          <>
            {/* Desktop: 90° turns to go around text */}

            {/* Hero (center) to Crane (right): down, right, down */}
            <motion.path
              d={`M ${heroCenter} ${heroBottom}
                  L ${heroCenter} ${heroToCraneTurnY}
                  L ${crane.centerX} ${heroToCraneTurnY}
                  L ${crane.centerX} ${crane.top}`}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-flow)"
              style={{ pathLength: heroToCrane }}
            />

            {/* Crane (right) to Blueprint (left): down, left, down */}
            <motion.path
              d={`M ${crane.centerX} ${crane.bottom}
                  L ${crane.centerX} ${craneToBlueprintTurnY}
                  L ${blueprint.centerX} ${craneToBlueprintTurnY}
                  L ${blueprint.centerX} ${blueprint.top}`}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-flow)"
              style={{ pathLength: craneToBlueprint }}
            />

            {/* Blueprint (left) to Framework (right): down, right, down */}
            <motion.path
              d={`M ${blueprint.centerX} ${blueprint.bottom}
                  L ${blueprint.centerX} ${blueprintToFrameworkTurnY}
                  L ${framework.centerX} ${blueprintToFrameworkTurnY}
                  L ${framework.centerX} ${framework.top}`}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-flow)"
              style={{ pathLength: blueprintToFramework }}
            />

            {/* Framework (right) to Skyline (center): down, left, down */}
            <motion.path
              d={`M ${framework.centerX} ${framework.bottom}
                  L ${framework.centerX} ${frameworkToSkylineTurnY}
                  L ${skyline.centerX} ${frameworkToSkylineTurnY}
                  L ${skyline.centerX} ${skyline.top}`}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-flow)"
              style={{ pathLength: frameworkToSkyline }}
            />
          </>
        ) : (
          <>
            {/* Mobile: simple vertical lines (everything is centered) */}

            <motion.line
              x1={heroCenter} y1={heroBottom}
              x2={crane.centerX} y2={crane.top}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-flow)"
              style={{ pathLength: heroToCrane }}
            />

            <motion.line
              x1={crane.centerX} y1={crane.bottom}
              x2={blueprint.centerX} y2={blueprint.top}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-flow)"
              style={{ pathLength: craneToBlueprint }}
            />

            <motion.line
              x1={blueprint.centerX} y1={blueprint.bottom}
              x2={framework.centerX} y2={framework.top}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-flow)"
              style={{ pathLength: blueprintToFramework }}
            />

            <motion.line
              x1={framework.centerX} y1={framework.bottom}
              x2={skyline.centerX} y2={skyline.top}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-flow)"
              style={{ pathLength: frameworkToSkyline }}
            />
          </>
        )}
      </svg>
    </>
  );
}
