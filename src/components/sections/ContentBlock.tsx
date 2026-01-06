import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "../ui/ScrollReveal";

interface ContentBlockProps {
  text: string;
  graphic?: "crane" | "blueprint" | "framework" | "skyline";
  graphicPosition?: "left" | "right";
  className?: string;
}

export function ContentBlock({
  text,
  graphic,
  graphicPosition = "right",
  className = ""
}: ContentBlockProps) {
  const hasGraphic = !!graphic;
  const hasText = text.length > 0;

  if (hasGraphic && !hasText) {
    return (
      <section className={`py-12 sm:py-16 md:py-24 lg:py-32 ${className}`}>
        <div className="container-wide flex justify-center">
          <GraphicElement variant={graphic} />
        </div>
      </section>
    );
  }

  return (
    <section className={`section-spacing ${className}`}>
      <div className="container-wide">
        {hasGraphic ? (
          <div className={`flex flex-col ${graphicPosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32 items-center`}>
            <div className="flex-1 lg:max-w-[50%] xl:max-w-[45%]">
              <ScrollReveal duration={1} distance={50}>
                <p className="text-body-large">{text}</p>
              </ScrollReveal>
            </div>
            <div className="flex-1 flex justify-center">
              <GraphicElement variant={graphic} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <ScrollReveal duration={1} distance={50}>
              <p className="text-body-large">{text}</p>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}

function GraphicElement({ variant }: { variant: "crane" | "blueprint" | "framework" | "skyline" }) {
  const isWide = variant === "skyline";
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <motion.div
      ref={containerRef}
      className={isWide
        ? "w-full max-w-[320px] h-[200px] sm:max-w-[360px] sm:h-[225px] md:max-w-[480px] md:h-[300px] lg:max-w-[600px] lg:h-[380px] xl:max-w-[700px] xl:h-[440px] 2xl:max-w-[800px] 2xl:h-[500px]"
        : "w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] 2xl:w-[580px] 2xl:h-[580px]"
      }
    >
      {variant === "crane" && <CraneGraphic scrollProgress={scrollYProgress} />}
      {variant === "blueprint" && <BlueprintGraphic scrollProgress={scrollYProgress} />}
      {variant === "framework" && <FrameworkGraphic scrollProgress={scrollYProgress} />}
      {variant === "skyline" && <SkylineGraphic scrollProgress={scrollYProgress} />}
    </motion.div>
  );
}

// Helper to create staggered scroll transforms
function useScrollTransform(
  scrollProgress: MotionValue<number>,
  startAt: number,
  endAt: number,
  from: number = 0,
  to: number = 1
) {
  return useTransform(scrollProgress, [startAt, endAt], [from, to]);
}

interface GraphicProps {
  scrollProgress: MotionValue<number>;
}

// Tower crane with detailed lattice structure
function CraneGraphic({ scrollProgress }: GraphicProps) {
  // Animation window: 0.10 (line enters) to 0.80 (line exits)
  // Flow line
  const flowIn = useScrollTransform(scrollProgress, 0.10, 0.20);
  const flowThrough = useScrollTransform(scrollProgress, 0.18, 0.72);
  const flowOut = useScrollTransform(scrollProgress, 0.70, 0.80);

  // Animation builds TOP to BOTTOM (following the flow line direction)
  // Peak and warning light first (very top)
  const peak = useScrollTransform(scrollProgress, 0.12, 0.22);
  // Pendant lines from peak
  const pendant = useScrollTransform(scrollProgress, 0.16, 0.26);
  // Jib extends outward from top
  const jibTop = useScrollTransform(scrollProgress, 0.18, 0.30);
  const jibBottom = useScrollTransform(scrollProgress, 0.20, 0.32);
  const jibLattice = useScrollTransform(scrollProgress, 0.24, 0.36);
  const counterJib = useScrollTransform(scrollProgress, 0.22, 0.34);
  // Trolley and hook descend
  const trolley = useScrollTransform(scrollProgress, 0.30, 0.40);
  const hook = useScrollTransform(scrollProgress, 0.34, 0.48);
  const load = useScrollTransform(scrollProgress, 0.42, 0.54);
  // Cabin and slewing unit
  const cabin = useScrollTransform(scrollProgress, 0.28, 0.38);
  const slewing = useScrollTransform(scrollProgress, 0.32, 0.42);
  // Tower builds downward from top
  const towerLeft = useScrollTransform(scrollProgress, 0.36, 0.56);
  const towerRight = useScrollTransform(scrollProgress, 0.38, 0.58);
  const lattice = useScrollTransform(scrollProgress, 0.40, 0.60);
  // Building in background
  const building = useScrollTransform(scrollProgress, 0.50, 0.65);
  // Foundation and ground last (bottom)
  const foundation = useScrollTransform(scrollProgress, 0.60, 0.72);
  const ground = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Flowing line - follows crane structure: enters at peak, down A-frame, along left tower rail */}
      <motion.path
        d="M 100 0 L 100 18"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowIn }}
      />
      <motion.path
        d="M 100 18 L 92 38 L 92 170"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: flowThrough }}
      />
      <motion.path
        d="M 92 170 L 92 185 L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: flowOut }}
      />

      {/* Ground and construction site base */}
      <motion.line
        x1="10" y1="185" x2="190" y2="185"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        style={{ pathLength: ground }}
      />

      {/* Crane base/foundation */}
      <motion.path
        d="M 80 185 L 80 175 L 120 175 L 120 185 M 85 175 L 85 170 L 115 170 L 115 175"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        style={{ pathLength: foundation }}
      />

      {/* Main tower - left rail (draws top to bottom) */}
      <motion.line
        x1="92" y1="38" x2="92" y2="170"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        style={{ pathLength: towerLeft }}
      />
      {/* Main tower - right rail (draws top to bottom) */}
      <motion.line
        x1="108" y1="38" x2="108" y2="170"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        style={{ pathLength: towerRight }}
      />

      {/* Tower lattice cross-bracing (top to bottom) */}
      {[45, 60, 75, 90, 105, 120, 135, 150, 165].map((y, i) => (
        <motion.path
          key={`lattice-${i}`}
          d={`M 92 ${y} L 108 ${y + 12} M 108 ${y} L 92 ${y + 12} M 92 ${y + 6} L 108 ${y + 6}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          style={{ pathLength: lattice, opacity: lattice }}
        />
      ))}

      {/* Slewing unit (turntable) */}
      <motion.rect
        x="88" y="35" width="24" height="8"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.5"
        style={{ opacity: slewing, scale: slewing }}
      />

      {/* Operator cabin */}
      <motion.path
        d="M 94 35 L 94 26 L 106 26 L 106 35 M 96 32 L 104 32"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        style={{ pathLength: cabin }}
      />

      {/* Main jib (horizontal boom) - top chord */}
      <motion.line
        x1="100" y1="28" x2="175" y2="28"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        style={{ pathLength: jibTop }}
      />
      {/* Main jib - bottom chord */}
      <motion.line
        x1="100" y1="35" x2="175" y2="35"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        style={{ pathLength: jibBottom }}
      />
      {/* Jib lattice */}
      {[115, 130, 145, 160].map((x, i) => (
        <motion.path
          key={`jib-lat-${i}`}
          d={`M ${x} 28 L ${x} 35 M ${x - 7} 28 L ${x} 35 M ${x} 28 L ${x + 7} 35`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
          style={{ pathLength: jibLattice, opacity: jibLattice }}
        />
      ))}
      {/* Jib tip */}
      <motion.path
        d="M 175 28 L 178 31 L 175 35"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        style={{ pathLength: jibLattice }}
      />

      {/* Counter-jib */}
      <motion.line
        x1="100" y1="30" x2="45" y2="30"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        style={{ pathLength: counterJib }}
      />
      {/* Counterweights */}
      {[52, 60, 68].map((x, i) => (
        <motion.rect
          key={`cw-${i}`}
          x={x} y="30" width="6" height="10"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          style={{ opacity: counterJib }}
        />
      ))}

      {/* Tower peak / A-frame */}
      <motion.path
        d="M 92 38 L 100 18 L 108 38 M 96 28 L 100 18 L 104 28"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        style={{ pathLength: peak }}
      />

      {/* Pendant lines (cables from peak to jib) */}
      <motion.path
        d="M 100 18 L 140 28 M 100 18 L 175 28"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
        style={{ pathLength: pendant }}
      />
      {/* Counter-jib pendant */}
      <motion.line
        x1="100" y1="18" x2="50" y2="30"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.5"
        style={{ pathLength: pendant }}
      />

      {/* Trolley */}
      <motion.rect
        x="148" y="34" width="8" height="4"
        fill="rgba(255,255,255,0.15)"
        style={{ opacity: trolley }}
      />

      {/* Hook block and cable */}
      <motion.path
        d="M 152 38 L 152 95 M 149 95 L 155 95 L 155 100 Q 152 105, 149 100 L 149 95"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        style={{ pathLength: hook }}
      />

      {/* Load (steel beam) */}
      <motion.g style={{ opacity: load }}>
        <rect x="140" y="108" width="24" height="4" fill="rgba(255,255,255,0.12)" />
        <line x1="140" y1="108" x2="140" y2="112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="164" y1="108" x2="164" y2="112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="145" y1="105" x2="152" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="159" y1="105" x2="152" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.g>

      {/* Building under construction (background - draws top to bottom) */}
      <motion.g style={{ opacity: building }}>
        <line x1="25" y1="140" x2="25" y2="185" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="55" y1="140" x2="55" y2="185" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="25" y1="140" x2="55" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="25" y1="160" x2="55" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </motion.g>

      {/* Warning light */}
      <motion.circle
        cx="100" cy="18" r="2"
        fill="rgba(255,255,255,0.5)"
        style={{ opacity: peak }}
      />
    </motion.svg>
  );
}

// Architectural blueprint with grid and details
function BlueprintGraphic({ scrollProgress }: GraphicProps) {
  // Animation window: 0.10 (line enters) to 0.80 (line exits)
  // Flow line
  const flowIn = useScrollTransform(scrollProgress, 0.10, 0.20);
  const flowThrough = useScrollTransform(scrollProgress, 0.18, 0.72);
  const flowOut = useScrollTransform(scrollProgress, 0.70, 0.80);

  // Animation builds TOP to BOTTOM (following the flow line direction)
  const grid = useScrollTransform(scrollProgress, 0.12, 0.22);
  const outline = useScrollTransform(scrollProgress, 0.16, 0.32);
  // Top elements first
  const northArrow = useScrollTransform(scrollProgress, 0.20, 0.30);
  const kitchen = useScrollTransform(scrollProgress, 0.24, 0.36);
  const windows = useScrollTransform(scrollProgress, 0.28, 0.42);
  // Middle elements
  const walls = useScrollTransform(scrollProgress, 0.34, 0.50);
  const doors = useScrollTransform(scrollProgress, 0.40, 0.54);
  const labels = useScrollTransform(scrollProgress, 0.44, 0.56);
  const bathroom = useScrollTransform(scrollProgress, 0.48, 0.60);
  // Bottom elements last
  const stairs = useScrollTransform(scrollProgress, 0.54, 0.66);
  const dimensions = useScrollTransform(scrollProgress, 0.60, 0.72);
  const scale = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Flowing line - follows interior wall at x=90, then along bottom edge */}
      <motion.path
        d="M 90 0 L 90 30"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowIn }}
      />
      <motion.path
        d="M 90 30 L 90 110 L 90 170"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowThrough }}
      />
      <motion.path
        d="M 90 170 L 90 200"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowOut }}
      />

      {/* Background grid */}
      <motion.g style={{ opacity: grid }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`vg-${i}`} x1={20 + i * 16} y1="20" x2={20 + i * 16} y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`hg-${i}`} x1="20" y1={20 + i * 16} x2="180" y2={20 + i * 16} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
      </motion.g>

      {/* Main building outline */}
      <motion.path
        d="M 30 30 L 170 30 L 170 170 L 30 170 Z"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        style={{ pathLength: outline }}
      />

      {/* Interior walls */}
      <motion.path
        d="M 90 30 L 90 110 M 30 85 L 90 85 M 90 130 L 170 130 M 130 85 L 130 170"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        style={{ pathLength: walls }}
      />

      {/* Door openings */}
      <motion.g style={{ opacity: doors }}>
        <path d="M 55 85 L 55 75" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 55 85 A 10 10 0 0 0 65 85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
        <path d="M 90 150 L 90 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 90 150 A 10 10 0 0 1 100 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
        <path d="M 130 105 L 130 95" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 130 105 A 10 10 0 0 1 140 105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
      </motion.g>

      {/* Windows */}
      <motion.g style={{ opacity: windows }}>
        {[50, 75, 120, 145].map((x, i) => (
          <g key={`tw-${i}`}>
            <line x1={x} y1="30" x2={x + 15} y2="30" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1={x} y1="26" x2={x} y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1={x + 15} y1="26" x2={x + 15} y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
        {[50, 100, 145].map((y, i) => (
          <g key={`lw-${i}`}>
            <line x1="30" y1={y} x2="30" y2={y + 15} stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1="26" y1={y} x2="30" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="26" y1={y + 15} x2="30" y2={y + 15} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
        {[50, 145].map((y, i) => (
          <g key={`rw-${i}`}>
            <line x1="170" y1={y} x2="170" y2={y + 15} stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1="170" y1={y} x2="174" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="170" y1={y + 15} x2="174" y2={y + 15} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
      </motion.g>

      {/* Stairs */}
      <motion.g style={{ opacity: stairs }}>
        {[0, 3, 6, 9, 12, 15, 18].map((offset, i) => (
          <line key={`stair-${i}`} x1={140 + offset} y1="140" x2={140 + offset} y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        ))}
        <path d="M 138 140 L 160 140 L 160 160 L 138 160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <path d="M 140 150 L 158 150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </motion.g>

      {/* Kitchen */}
      <motion.g style={{ opacity: kitchen }}>
        <rect x="95" y="35" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="100" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
        <rect x="115" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <circle cx="117" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
        <circle cx="121" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      {/* Bathroom */}
      <motion.g style={{ opacity: bathroom }}>
        <ellipse cx="40" cy="100" rx="4" ry="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="37" y="96" width="6" height="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <rect x="50" y="90" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
      </motion.g>

      {/* Dimensions */}
      <motion.g style={{ opacity: dimensions }}>
        <line x1="30" y1="185" x2="170" y2="185" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="30" y1="183" x2="30" y2="187" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="170" y1="183" x2="170" y2="187" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="100" y1="183" x2="100" y2="187" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="15" y1="30" x2="15" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="13" y1="30" x2="17" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="13" y1="170" x2="17" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="13" y1="100" x2="17" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </motion.g>

      {/* Room labels */}
      {[[55, 55], [130, 55], [55, 140], [105, 150]].map(([x, y], i) => (
        <motion.rect
          key={`label-${i}`}
          x={x - 10} y={y - 4} width="20" height="8"
          fill="rgba(255,255,255,0.05)"
          style={{ opacity: labels, scale: labels }}
        />
      ))}

      {/* North arrow */}
      <motion.g style={{ opacity: northArrow, scale: northArrow }}>
        <circle cx="160" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <path d="M 160 47 L 160 63 M 155 52 L 160 47 L 165 52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="160" cy="47" r="1.5" fill="rgba(255,255,255,0.15)" />
      </motion.g>

      {/* Scale bar */}
      <motion.g style={{ opacity: scale }}>
        <rect x="35" y="180" width="30" height="2" fill="rgba(255,255,255,0.1)" />
        <rect x="35" y="180" width="15" height="2" fill="rgba(255,255,255,0.15)" />
      </motion.g>
    </motion.svg>
  );
}

// Steel frame structure with detailed I-beams
function FrameworkGraphic({ scrollProgress }: GraphicProps) {
  // Animation window: 0.10 (line enters) to 0.80 (line exits)
  // Flow line
  const flowIn = useScrollTransform(scrollProgress, 0.10, 0.20);
  const flowThrough = useScrollTransform(scrollProgress, 0.18, 0.72);
  const flowOut = useScrollTransform(scrollProgress, 0.70, 0.80);

  // Animation builds TOP to BOTTOM (following the flow line direction)
  // Crane and lifted beam first (very top)
  const craneCable = useScrollTransform(scrollProgress, 0.12, 0.22);
  const beam = useScrollTransform(scrollProgress, 0.16, 0.28);
  // Top floor first, then build downward
  const floors = useScrollTransform(scrollProgress, 0.22, 0.50);
  const flanges = useScrollTransform(scrollProgress, 0.28, 0.52);
  const stiffeners = useScrollTransform(scrollProgress, 0.32, 0.54);
  // Columns draw downward
  const columns = useScrollTransform(scrollProgress, 0.26, 0.58);
  // Cross bracing and connections
  const bracing = useScrollTransform(scrollProgress, 0.38, 0.56);
  const plates = useScrollTransform(scrollProgress, 0.44, 0.60);
  const bolts = useScrollTransform(scrollProgress, 0.48, 0.62);
  // Scaffolding alongside
  const scaffolding = useScrollTransform(scrollProgress, 0.50, 0.66);
  // Foundation and ground last (bottom)
  const foundation = useScrollTransform(scrollProgress, 0.60, 0.72);
  const ground = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Flowing line - follows column at x=80, from crane hook down to foundation */}
      <motion.path
        d="M 100 0 L 100 20 L 80 22"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: flowIn }}
      />
      <motion.path
        d="M 80 22 L 80 172"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowThrough }}
      />
      <motion.path
        d="M 80 172 L 80 180 L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: flowOut }}
      />

      {/* Ground */}
      <motion.line
        x1="15" y1="180" x2="185" y2="180"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: ground }}
      />

      {/* Foundation */}
      <motion.path
        d="M 30 180 L 30 175 L 170 175 L 170 180 M 35 175 L 35 172 L 165 172 L 165 175"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: foundation }}
      />

      {/* Main columns (draw top to bottom) */}
      {[40, 80, 120, 160].map((x, i) => (
        <motion.g key={`col-${i}`}>
          <motion.line
            x1={x} y1="22" x2={x} y2="172"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            style={{ pathLength: columns }}
          />
          {[22, 52, 82, 112, 142, 172].map((y, j) => (
            <motion.line
              key={`flange-${i}-${j}`}
              x1={x - 4} y1={y} x2={x + 4} y2={y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              style={{ opacity: flanges, scaleX: flanges }}
            />
          ))}
        </motion.g>
      ))}

      {/* Floor beams (top to bottom) */}
      {[22, 52, 82, 112, 142].map((y, i) => (
        <motion.g key={`floor-${i}`}>
          <motion.line
            x1="40" y1={y} x2="160" y2={y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            style={{ pathLength: floors }}
          />
          {[55, 70, 95, 105, 135, 150].map((x, j) => (
            <motion.line
              key={`stiff-${i}-${j}`}
              x1={x} y1={y - 2} x2={x} y2={y + 2}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
              style={{ opacity: stiffeners, scaleY: stiffeners }}
            />
          ))}
        </motion.g>
      ))}

      {/* Cross bracing */}
      <motion.path
        d="M 40 142 L 80 112 M 80 142 L 40 112"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: bracing }}
      />
      <motion.path
        d="M 40 82 L 80 52 M 80 82 L 40 52"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: bracing }}
      />
      <motion.path
        d="M 120 142 L 160 112 M 160 142 L 120 112"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: bracing }}
      />
      <motion.path
        d="M 120 82 L 160 52 M 160 82 L 120 52"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: bracing }}
      />

      {/* Connection plates */}
      {[
        [40, 142], [40, 112], [40, 82], [40, 52],
        [80, 142], [80, 112], [80, 82], [80, 52],
        [120, 142], [120, 112], [120, 82], [120, 52],
        [160, 142], [160, 112], [160, 82], [160, 52],
      ].map(([x, y], i) => (
        <motion.circle
          key={`plate-${i}`}
          cx={x} cy={y} r="3"
          fill="rgba(255,255,255,0.12)"
          style={{ opacity: plates, scale: plates }}
        />
      ))}

      {/* Bolt patterns */}
      {[[40, 112], [80, 82], [120, 112], [160, 82]].map(([x, y], i) => (
        <motion.g key={`bolts-${i}`} style={{ opacity: bolts }}>
          {[[-2, -2], [2, -2], [-2, 2], [2, 2]].map(([dx, dy], j) => (
            <motion.circle
              key={`bolt-${i}-${j}`}
              cx={x + dx} cy={y + dy} r="0.8"
              fill="rgba(255,255,255,0.2)"
              style={{ scale: bolts }}
            />
          ))}
        </motion.g>
      ))}

      {/* Scaffolding (draws top to bottom) */}
      <motion.path
        d="M 25 52 L 25 172 M 25 52 L 40 52 M 25 82 L 40 82 M 25 112 L 40 112 M 25 142 L 40 142 M 25 172 L 40 172"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="3,2"
        style={{ pathLength: scaffolding }}
      />

      {/* Crane cable at top */}
      <motion.path
        d="M 100 5 L 100 15 M 97 15 L 103 15 L 103 20 Q 100 24, 97 20 L 97 15"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        style={{ opacity: craneCable }}
      />

      {/* Beam being lifted */}
      <motion.g style={{ opacity: beam }}>
        <rect x="85" y="28" width="30" height="5" fill="rgba(255,255,255,0.15)" />
        <line x1="85" y1="28" x2="85" y2="33" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="115" y1="28" x2="115" y2="33" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="93" y1="25" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="107" y1="25" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.g>
    </motion.svg>
  );
}

// City skyline with refined architecture
function SkylineGraphic({ scrollProgress }: GraphicProps) {
  // Animation window: 0.10 to 0.78 - LINE STOPS at ground level (no exit)
  // Flow line
  const flowIn = useScrollTransform(scrollProgress, 0.10, 0.20);
  const flowThrough = useScrollTransform(scrollProgress, 0.18, 0.78);
  // No flowOut - line terminates at the skyline ground

  // Animation builds TOP to BOTTOM (following the flow line direction)
  // Beacon lights first (very top of buildings)
  const lights = useScrollTransform(scrollProgress, 0.12, 0.24);
  // Buildings draw from peaks down - tallest first
  const b3 = useScrollTransform(scrollProgress, 0.14, 0.40); // Tallest (center)
  const b5 = useScrollTransform(scrollProgress, 0.18, 0.42); // Tower with antenna
  const b1 = useScrollTransform(scrollProgress, 0.22, 0.44); // Art deco
  const b7 = useScrollTransform(scrollProgress, 0.26, 0.46); // Narrow tower
  const b6 = useScrollTransform(scrollProgress, 0.30, 0.48); // Modern cantilever
  const b2 = useScrollTransform(scrollProgress, 0.34, 0.50); // Glass tower
  const b4 = useScrollTransform(scrollProgress, 0.38, 0.52); // Wide commercial
  const b8 = useScrollTransform(scrollProgress, 0.42, 0.54); // Low rise
  // Windows appear after structure
  const windows = useScrollTransform(scrollProgress, 0.48, 0.64);
  const details = useScrollTransform(scrollProgress, 0.56, 0.70);
  // Ground line last (bottom)
  const ground = useScrollTransform(scrollProgress, 0.66, 0.78);

  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full">
      {/* Flowing line - follows tallest building down to ground, then STOPS */}
      <motion.path
        d="M 112 0 L 112 12"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowIn }}
      />
      <motion.path
        d="M 112 12 L 112 180"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: flowThrough }}
      />
      {/* Line terminates at ground - no exit path */}

      {/* Ground line */}
      <motion.line
        x1="5" y1="180" x2="315" y2="180"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        style={{ pathLength: ground }}
      />

      {/* Building 1 - Art Deco tower (draws from peak down) */}
      <motion.path
        d="M 27 55 L 22 60 L 17 65 L 12 70 L 12 180 M 27 55 L 32 60 L 37 65 L 42 70 L 42 180"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        style={{ pathLength: b1 }}
      />
      <motion.line x1="27" y1="55" x2="27" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
        style={{ pathLength: b1 }}
      />
      {[85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b1-w-${i}`} style={{ opacity: windows }}>
          <rect x="17" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)" />
          <rect x="34" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)" />
        </motion.g>
      ))}

      {/* Building 2 - Modern glass tower (draws from top down) */}
      <motion.path
        d="M 55 80 L 50 85 L 50 180 M 80 80 L 85 85 L 85 180 M 55 80 L 80 80"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        style={{ pathLength: b2 }}
      />
      {[95, 110, 125, 140, 155, 170].map((y, i) => (
        <motion.line key={`b2-h-${i}`} x1="52" y1={y} x2="83" y2={y}
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
          style={{ opacity: details }} />
      ))}
      {[58, 67, 76].map((x, i) => (
        <motion.line key={`b2-v-${i}`} x1={x} y1="85" x2={x} y2="180"
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
          style={{ opacity: details }} />
      ))}

      {/* Building 3 - Landmark skyscraper (tallest, draws from peak down) */}
      <motion.path
        d="M 112 12 L 102 22 L 102 30 L 95 30 L 95 180 M 112 12 L 122 22 L 122 30 L 129 30 L 129 180"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        style={{ pathLength: b3 }}
      />
      <motion.line x1="112" y1="12" x2="112" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        style={{ pathLength: b3 }}
      />
      <motion.path d="M 98 30 L 98 60 M 126 30 L 126 60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        style={{ opacity: details }}
      />
      {[40, 55, 70, 85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b3-w-${i}`} style={{ opacity: windows }}>
          <rect x="100" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)" />
          <rect x="108" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)" />
          <rect x="120" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)" />
        </motion.g>
      ))}

      {/* Building 4 - Wide commercial (draws from top down) */}
      <motion.path
        d="M 143 88 L 138 95 L 138 180 M 177 88 L 182 95 L 182 180 M 143 88 L 177 88"
        fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="1"
        style={{ pathLength: b4 }}
      />
      <motion.path d="M 150 82 L 150 88 M 158 82 L 158 88 M 150 82 L 158 82 M 165 85 L 165 88 M 170 85 L 170 88 M 165 85 L 170 85"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        style={{ opacity: details }}
      />
      {[105, 120, 135, 150, 165].map((y, i) => (
        <motion.g key={`b4-w-${i}`} style={{ opacity: windows }}>
          {[143, 152, 161, 170].map((x, j) => (
            <rect key={`b4-w-${i}-${j}`} x={x} y={y} width="5" height="6" fill="rgba(255,255,255,0.06)" />
          ))}
        </motion.g>
      ))}

      {/* Building 5 - Tower with antenna (draws from antenna down) */}
      <motion.path
        d="M 205 18 L 205 48 L 200 48 L 200 55 L 192 55 L 192 180 M 207 18 L 207 48 L 212 48 L 212 55 L 220 55 L 220 180 M 205 18 L 207 18"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        style={{ pathLength: b5 }}
      />
      {[70, 88, 106, 124, 142, 160].map((y, i) => (
        <motion.g key={`b5-w-${i}`} style={{ opacity: windows }}>
          <rect x="197" y={y} width="4" height="6" fill="rgba(255,255,255,0.07)" />
          <rect x="211" y={y} width="4" height="6" fill="rgba(255,255,255,0.07)" />
        </motion.g>
      ))}

      {/* Building 6 - Modern with cantilever (draws from top down) */}
      <motion.path
        d="M 235 70 L 235 75 L 230 75 L 230 180 M 260 70 L 265 75 L 268 75 L 268 105 L 265 105 L 265 180 M 235 70 L 260 70"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: b6 }}
      />
      {[85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b6-w-${i}`} style={{ opacity: windows }}>
          {[235, 245, 255].map((x, j) => (
            <rect key={`b6-w-${i}-${j}`} x={x} y={y} width="4" height="5" fill="rgba(255,255,255,0.05)" />
          ))}
        </motion.g>
      ))}

      {/* Building 7 - Narrow tower (draws from peak down) */}
      <motion.path
        d="M 283 60 L 278 65 L 278 180 M 283 60 L 288 65 L 288 180"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
        style={{ pathLength: b7 }}
      />
      {[80, 100, 120, 140, 160].map((y, i) => (
        <motion.rect key={`b7-w-${i}`} x="281" y={y} width="4" height="6" fill="rgba(255,255,255,0.05)"
          style={{ opacity: windows }} />
      ))}

      {/* Building 8 - Low rise (draws from top down) */}
      <motion.path
        d="M 295 120 L 295 180 M 312 120 L 312 180 M 295 120 L 312 120"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
        style={{ pathLength: b8 }}
      />
      {[130, 145, 160].map((y, i) => (
        <motion.g key={`b8-w-${i}`} style={{ opacity: windows }}>
          <rect x="298" y={y} width="4" height="5" fill="rgba(255,255,255,0.04)" />
          <rect x="305" y={y} width="4" height="5" fill="rgba(255,255,255,0.04)" />
        </motion.g>
      ))}

      {/* Beacon lights */}
      <motion.circle cx="27" cy="55" r="1.5" fill="rgba(255,255,255,0.35)"
        style={{ opacity: lights }}
      />
      <motion.circle cx="112" cy="12" r="2" fill="rgba(255,255,255,0.5)"
        style={{ opacity: lights }}
      />
      <motion.circle cx="206" cy="18" r="1.5" fill="rgba(255,255,255,0.35)"
        style={{ opacity: lights }}
      />
      <motion.circle cx="283" cy="60" r="1" fill="rgba(255,255,255,0.25)"
        style={{ opacity: lights }}
      />
    </motion.svg>
  );
}
