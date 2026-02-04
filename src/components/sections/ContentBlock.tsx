import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "../ui/ScrollReveal";

interface ContentBlockProps {
  text: string;
  graphic?: "crane" | "blueprint" | "framework" | "skyline" | "completed" | "document";
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

function GraphicElement({ variant }: { variant: "crane" | "blueprint" | "framework" | "skyline" | "completed" | "document" }) {
  const isWide = variant === "skyline" || variant === "completed" || variant === "document";
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <motion.div
      ref={containerRef}
      data-graphic={variant}
      className={isWide
        ? "w-full max-w-[320px] h-[200px] sm:max-w-[360px] sm:h-[225px] md:max-w-[480px] md:h-[300px] lg:max-w-[600px] lg:h-[380px] xl:max-w-[700px] xl:h-[440px] 2xl:max-w-[800px] 2xl:h-[500px]"
        : "w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] 2xl:w-[580px] 2xl:h-[580px]"
      }
    >
      {variant === "crane" && <CraneGraphic scrollProgress={scrollYProgress} />}
      {variant === "blueprint" && <BlueprintGraphic scrollProgress={scrollYProgress} />}
      {variant === "framework" && <FrameworkGraphic scrollProgress={scrollYProgress} />}
      {variant === "skyline" && <RenovationGraphic scrollProgress={scrollYProgress} />}
      {variant === "completed" && <CompletedBuildingGraphic scrollProgress={scrollYProgress} />}
      {variant === "document" && <DocumentSignatureGraphic scrollProgress={scrollYProgress} />}
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
  // Flow line - straight through
  const flowThrough = useScrollTransform(scrollProgress, 0.10, 0.75);

  // Animation builds TOP to BOTTOM
  const peak = useScrollTransform(scrollProgress, 0.12, 0.22);
  const pendant = useScrollTransform(scrollProgress, 0.16, 0.26);
  const jibTop = useScrollTransform(scrollProgress, 0.18, 0.30);
  const jibBottom = useScrollTransform(scrollProgress, 0.20, 0.32);
  const jibLattice = useScrollTransform(scrollProgress, 0.24, 0.36);
  const counterJib = useScrollTransform(scrollProgress, 0.22, 0.34);
  const trolley = useScrollTransform(scrollProgress, 0.30, 0.40);
  const hook = useScrollTransform(scrollProgress, 0.34, 0.48);
  const load = useScrollTransform(scrollProgress, 0.42, 0.54);
  const cabin = useScrollTransform(scrollProgress, 0.28, 0.38);
  const slewing = useScrollTransform(scrollProgress, 0.32, 0.42);
  const towerLeft = useScrollTransform(scrollProgress, 0.36, 0.56);
  const towerRight = useScrollTransform(scrollProgress, 0.38, 0.58);
  const lattice = useScrollTransform(scrollProgress, 0.40, 0.60);
  const building = useScrollTransform(scrollProgress, 0.50, 0.65);
  const foundation = useScrollTransform(scrollProgress, 0.60, 0.72);
  const ground = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full gpu-accelerated">
      {/* Glow filter for flow line */}
      <defs>
        <filter id="glow-crane" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* FLOW LINE - follows crane geometry: down to peak, along A-frame, down tower */}
      <motion.path
        d="M 100 0
           L 100 18
           L 92 38
           L 92 100
           L 108 100
           L 108 170
           L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-crane)"
        style={{ pathLength: flowThrough }}
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
  const flowThrough = useScrollTransform(scrollProgress, 0.10, 0.75);
  const grid = useScrollTransform(scrollProgress, 0.12, 0.22);
  const outline = useScrollTransform(scrollProgress, 0.16, 0.32);
  const northArrow = useScrollTransform(scrollProgress, 0.20, 0.30);
  const kitchen = useScrollTransform(scrollProgress, 0.24, 0.36);
  const windows = useScrollTransform(scrollProgress, 0.28, 0.42);
  const walls = useScrollTransform(scrollProgress, 0.34, 0.50);
  const doors = useScrollTransform(scrollProgress, 0.40, 0.54);
  const labels = useScrollTransform(scrollProgress, 0.44, 0.56);
  const bathroom = useScrollTransform(scrollProgress, 0.48, 0.60);
  const stairs = useScrollTransform(scrollProgress, 0.54, 0.66);
  const dimensions = useScrollTransform(scrollProgress, 0.60, 0.72);
  const scale = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full gpu-accelerated">
      <defs>
        <filter id="glow-blueprint" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d="M 100 0 L 100 30 L 90 30 L 90 85 L 30 85 L 30 170 L 100 170 L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-blueprint)"
        style={{ pathLength: flowThrough }}
      />

      <motion.g style={{ opacity: grid }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`vg-${i}`} x1={20 + i * 16} y1="20" x2={20 + i * 16} y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`hg-${i}`} x1="20" y1={20 + i * 16} x2="180" y2={20 + i * 16} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
      </motion.g>

      <motion.path
        d="M 30 30 L 170 30 L 170 170 L 30 170 Z"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        style={{ pathLength: outline }}
      />

      <motion.path
        d="M 90 30 L 90 110 M 30 85 L 90 85 M 90 130 L 170 130 M 130 85 L 130 170"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        style={{ pathLength: walls }}
      />

      <motion.g style={{ opacity: doors }}>
        <path d="M 55 85 L 55 75" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 55 85 A 10 10 0 0 0 65 85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
        <path d="M 90 150 L 90 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 90 150 A 10 10 0 0 1 100 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
        <path d="M 130 105 L 130 95" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 130 105 A 10 10 0 0 1 140 105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
      </motion.g>

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

      <motion.g style={{ opacity: stairs }}>
        {[0, 3, 6, 9, 12, 15, 18].map((offset, i) => (
          <line key={`stair-${i}`} x1={140 + offset} y1="140" x2={140 + offset} y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        ))}
        <path d="M 138 140 L 160 140 L 160 160 L 138 160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <path d="M 140 150 L 158 150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </motion.g>

      <motion.g style={{ opacity: kitchen }}>
        <rect x="95" y="35" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="100" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
        <rect x="115" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <circle cx="117" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
        <circle cx="121" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      <motion.g style={{ opacity: bathroom }}>
        <ellipse cx="40" cy="100" rx="4" ry="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="37" y="96" width="6" height="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <rect x="50" y="90" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
      </motion.g>

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

      {[[55, 55], [130, 55], [55, 140], [105, 150]].map(([x, y], i) => (
        <motion.rect
          key={`label-${i}`}
          x={x - 10} y={y - 4} width="20" height="8"
          fill="rgba(255,255,255,0.05)"
          style={{ opacity: labels, scale: labels }}
        />
      ))}

      <motion.g style={{ opacity: northArrow, scale: northArrow }}>
        <circle cx="160" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <path d="M 160 47 L 160 63 M 155 52 L 160 47 L 165 52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="160" cy="47" r="1.5" fill="rgba(255,255,255,0.15)" />
      </motion.g>

      <motion.g style={{ opacity: scale }}>
        <rect x="35" y="180" width="30" height="2" fill="rgba(255,255,255,0.1)" />
        <rect x="35" y="180" width="15" height="2" fill="rgba(255,255,255,0.15)" />
      </motion.g>
    </motion.svg>
  );
}

// Steel frame structure with detailed I-beams
function FrameworkGraphic({ scrollProgress }: GraphicProps) {
  const flowThrough = useScrollTransform(scrollProgress, 0.10, 0.75);
  const craneCable = useScrollTransform(scrollProgress, 0.12, 0.22);
  const beam = useScrollTransform(scrollProgress, 0.16, 0.28);
  const floors = useScrollTransform(scrollProgress, 0.22, 0.50);
  const flanges = useScrollTransform(scrollProgress, 0.28, 0.52);
  const stiffeners = useScrollTransform(scrollProgress, 0.32, 0.54);
  const columns = useScrollTransform(scrollProgress, 0.26, 0.58);
  const bracing = useScrollTransform(scrollProgress, 0.38, 0.56);
  const plates = useScrollTransform(scrollProgress, 0.44, 0.60);
  const bolts = useScrollTransform(scrollProgress, 0.48, 0.62);
  const scaffolding = useScrollTransform(scrollProgress, 0.50, 0.66);
  const foundation = useScrollTransform(scrollProgress, 0.60, 0.72);
  const ground = useScrollTransform(scrollProgress, 0.68, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full gpu-accelerated">
      <defs>
        <filter id="glow-framework" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d="M 100 0 L 100 22 L 80 22 L 80 82 L 120 82 L 120 142 L 80 142 L 80 180 L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-framework)"
        style={{ pathLength: flowThrough }}
      />

      <motion.line x1="15" y1="180" x2="185" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ pathLength: ground }} />

      <motion.path
        d="M 30 180 L 30 175 L 170 175 L 170 180 M 35 175 L 35 172 L 165 172 L 165 175"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        style={{ pathLength: foundation }}
      />

      {[40, 80, 120, 160].map((x, i) => (
        <motion.g key={`col-${i}`}>
          <motion.line x1={x} y1="22" x2={x} y2="172" stroke="rgba(255,255,255,0.2)" strokeWidth="3"
            style={{ pathLength: columns }} />
          {[22, 52, 82, 112, 142, 172].map((y, j) => (
            <motion.line key={`flange-${i}-${j}`} x1={x - 4} y1={y} x2={x + 4} y2={y}
              stroke="rgba(255,255,255,0.15)" strokeWidth="1"
              style={{ opacity: flanges, scaleX: flanges }} />
          ))}
        </motion.g>
      ))}

      {[22, 52, 82, 112, 142].map((y, i) => (
        <motion.g key={`floor-${i}`}>
          <motion.line x1="40" y1={y} x2="160" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="2"
            style={{ pathLength: floors }} />
          {[55, 70, 95, 105, 135, 150].map((x, j) => (
            <motion.line key={`stiff-${i}-${j}`} x1={x} y1={y - 2} x2={x} y2={y + 2}
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
              style={{ opacity: stiffeners, scaleY: stiffeners }} />
          ))}
        </motion.g>
      ))}

      <motion.path d="M 40 142 L 80 112 M 80 142 L 40 112" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ pathLength: bracing }} />
      <motion.path d="M 40 82 L 80 52 M 80 82 L 40 52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ pathLength: bracing }} />
      <motion.path d="M 120 142 L 160 112 M 160 142 L 120 112" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ pathLength: bracing }} />
      <motion.path d="M 120 82 L 160 52 M 160 82 L 120 52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ pathLength: bracing }} />

      {[
        [40, 142], [40, 112], [40, 82], [40, 52],
        [80, 142], [80, 112], [80, 82], [80, 52],
        [120, 142], [120, 112], [120, 82], [120, 52],
        [160, 142], [160, 112], [160, 82], [160, 52],
      ].map(([x, y], i) => (
        <motion.circle key={`plate-${i}`} cx={x} cy={y} r="3" fill="rgba(255,255,255,0.12)"
          style={{ opacity: plates, scale: plates }} />
      ))}

      {[[40, 112], [80, 82], [120, 112], [160, 82]].map(([x, y], i) => (
        <motion.g key={`bolts-${i}`} style={{ opacity: bolts }}>
          {[[-2, -2], [2, -2], [-2, 2], [2, 2]].map(([dx, dy], j) => (
            <motion.circle key={`bolt-${i}-${j}`} cx={x + dx} cy={y + dy} r="0.8" fill="rgba(255,255,255,0.2)"
              style={{ scale: bolts }} />
          ))}
        </motion.g>
      ))}

      <motion.path
        d="M 25 52 L 25 172 M 25 52 L 40 52 M 25 82 L 40 82 M 25 112 L 40 112 M 25 142 L 40 142 M 25 172 L 40 172"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="3,2"
        style={{ pathLength: scaffolding }}
      />

      <motion.path
        d="M 100 5 L 100 15 M 97 15 L 103 15 L 103 20 Q 100 24, 97 20 L 97 15"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        style={{ opacity: craneCable }}
      />

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

// Building Under Renovation - Half old facade, half modern (SAVE theme)
function RenovationGraphic({ scrollProgress }: GraphicProps) {
  const flowThrough = useScrollTransform(scrollProgress, 0.08, 0.78);
  const ground = useScrollTransform(scrollProgress, 0.10, 0.20);
  const oldStructure = useScrollTransform(scrollProgress, 0.14, 0.32);
  const oldDetails = useScrollTransform(scrollProgress, 0.28, 0.44);
  const scaffolding = useScrollTransform(scrollProgress, 0.36, 0.52);
  const newStructure = useScrollTransform(scrollProgress, 0.44, 0.62);
  const newDetails = useScrollTransform(scrollProgress, 0.56, 0.72);
  const workers = useScrollTransform(scrollProgress, 0.64, 0.78);

  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full gpu-accelerated">
      <defs>
        <filter id="glow-reno" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Flow line - enters from top center, flows through scaffolding, across to new building, exits center bottom */}
      <motion.path
        d="M 160 0
           L 160 50
           L 167 50
           L 167 85
           L 143 85
           L 143 120
           L 167 120
           L 167 155
           L 170 155
           L 170 160
           L 280 160
           L 280 185
           L 160 185
           L 160 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-reno)"
        style={{ pathLength: flowThrough }}
      />

      {/* Ground line */}
      <motion.line x1="20" y1="185" x2="300" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
        style={{ pathLength: ground }} />

      {/* === LEFT SIDE - OLD DETERIORATING FACADE === */}

      {/* Old building structure - slightly crooked/worn */}
      <motion.path
        d="M 40 185 L 40 35 L 45 30 L 140 30 L 140 185"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        style={{ pathLength: oldStructure }}
      />

      {/* Old floor lines - uneven */}
      <motion.g style={{ opacity: oldDetails }}>
        <line x1="40" y1="60" x2="140" y2="62" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="40" y1="95" x2="140" y2="94" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="40" y1="130" x2="140" y2="131" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="40" y1="160" x2="140" y2="159" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </motion.g>

      {/* Old windows - misaligned, some broken */}
      <motion.g style={{ opacity: oldDetails }}>
        {/* Row 1 */}
        <rect x="50" y="38" width="12" height="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="50" y1="38" x2="62" y2="54" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="75" y="40" width="12" height="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="100" y="39" width="12" height="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="103" y1="42" x2="109" y2="51" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="120" y="38" width="10" height="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

        {/* Row 2 */}
        <rect x="48" y="68" width="12" height="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="74" y="70" width="12" height="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="74" y1="70" x2="86" y2="84" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="98" y="69" width="12" height="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="118" y="68" width="12" height="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

        {/* Row 3 */}
        <rect x="50" y="103" width="12" height="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="76" y="104" width="12" height="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="100" y="102" width="12" height="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        <rect x="120" y="105" width="10" height="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

        {/* Row 4 - ground floor */}
        <rect x="50" y="138" width="14" height="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="80" y="140" width="20" height="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        <rect x="115" y="138" width="14" height="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      </motion.g>

      {/* Cracks and damage on old side */}
      <motion.g style={{ opacity: oldDetails }}>
        <path d="M 55 30 L 58 45 L 52 58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <path d="M 95 94 L 92 105 L 98 118 L 94 128" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <path d="M 120 62 L 125 75 L 118 85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <path d="M 70 130 L 68 145 L 72 155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        {/* Staining/water damage marks */}
        <path d="M 40 50 Q 45 55, 40 65" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
        <path d="M 40 100 Q 48 108, 40 120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
      </motion.g>

      {/* === CENTER - SCAFFOLDING/TRANSITION ZONE === */}

      <motion.g style={{ opacity: scaffolding }}>
        {/* Vertical scaffolding poles */}
        <line x1="145" y1="30" x2="145" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="165" y1="30" x2="165" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="160" y1="30" x2="160" y2="185" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />

        {/* Horizontal scaffolding platforms */}
        <line x1="143" y1="50" x2="167" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="143" y1="85" x2="167" y2="85" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="143" y1="120" x2="167" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="143" y1="155" x2="167" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* Cross bracing */}
        <line x1="145" y1="50" x2="165" y2="85" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="165" y1="50" x2="145" y2="85" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="145" y1="85" x2="165" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="165" y1="85" x2="145" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="145" y1="120" x2="165" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="165" y1="120" x2="145" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {/* Protective sheeting/mesh indication */}
        <rect x="146" y="32" width="18" height="150" fill="rgba(255,255,255,0.02)" />
      </motion.g>

      {/* === RIGHT SIDE - NEW MODERN FACADE === */}

      {/* New building structure - clean, precise */}
      <motion.path
        d="M 170 185 L 170 30 L 280 30 L 280 185"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        style={{ pathLength: newStructure }}
      />

      {/* New floor lines - perfectly level */}
      <motion.g style={{ opacity: newDetails }}>
        <line x1="170" y1="60" x2="280" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="170" y1="95" x2="280" y2="95" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="170" y1="130" x2="280" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="170" y1="160" x2="280" y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      </motion.g>

      {/* New modern windows - uniform, clean */}
      <motion.g style={{ opacity: newDetails }}>
        {/* Row 1 */}
        <rect x="180" y="36" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="208" y="36" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="236" y="36" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="264" y="36" width="10" height="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Row 2 */}
        <rect x="180" y="68" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="208" y="68" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="236" y="68" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="264" y="68" width="10" height="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Row 3 */}
        <rect x="180" y="103" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="208" y="103" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="236" y="103" width="18" height="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="264" y="103" width="10" height="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Row 4 - ground floor with larger windows */}
        <rect x="180" y="136" width="25" height="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="215" y="136" width="25" height="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="250" y="136" width="22" height="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </motion.g>

      {/* Modern facade details - clean panels */}
      <motion.g style={{ opacity: newDetails }}>
        {/* Horizontal accent lines */}
        <line x1="170" y1="32" x2="280" y2="32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <line x1="170" y1="162" x2="280" y2="162" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        {/* Vertical panel divisions */}
        <line x1="205" y1="30" x2="205" y2="185" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="233" y1="30" x2="233" y2="185" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="261" y1="30" x2="261" y2="185" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      </motion.g>

      {/* Roof line - transition visible */}
      <motion.g style={{ opacity: newStructure }}>
        {/* Old roof line - uneven */}
        <path d="M 40 30 L 45 25 L 90 26 L 95 28 L 140 27" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* New roof line - clean parapet */}
        <line x1="170" y1="25" x2="280" y2="25" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <line x1="170" y1="30" x2="170" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="280" y1="30" x2="280" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </motion.g>

      {/* Workers on scaffolding */}
      <motion.g style={{ opacity: workers }}>
        {/* Worker 1 - on platform */}
        <g>
          <line x1="150" y1="44" x2="150" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="148" y1="48" x2="152" y2="48" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>
        {/* Worker 2 - on lower platform */}
        <g>
          <line x1="158" y1="114" x2="158" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="156" y1="118" x2="160" y2="118" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>
        {/* Worker 3 - ground level */}
        <g>
          <line x1="155" y1="179" x2="155" y2="185" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="153" y1="183" x2="157" y2="183" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>
      </motion.g>

      {/* Ground level details */}
      <motion.g style={{ opacity: ground }}>
        {/* Construction barrier/hoarding */}
        <line x1="135" y1="185" x2="175" y2="185" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        {/* Entrance to new section */}
        <rect x="220" y="165" width="20" height="20" fill="rgba(255,255,255,0.15)" />
        <line x1="230" y1="175" x2="230" y2="185" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  );
}

// Completed modern building - the finished product
function CompletedBuildingGraphic({ scrollProgress }: GraphicProps) {
  const flowThrough = useScrollTransform(scrollProgress, 0.08, 0.78);
  const ground = useScrollTransform(scrollProgress, 0.10, 0.20);
  const structure = useScrollTransform(scrollProgress, 0.14, 0.32);
  const floors = useScrollTransform(scrollProgress, 0.26, 0.42);
  const windows = useScrollTransform(scrollProgress, 0.36, 0.52);
  const details = useScrollTransform(scrollProgress, 0.46, 0.62);
  const entrance = useScrollTransform(scrollProgress, 0.56, 0.70);
  const finishing = useScrollTransform(scrollProgress, 0.64, 0.78);

  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full gpu-accelerated">
      <defs>
        <filter id="glow-completed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Flow line - enters from top, flows through building structure, exits at entrance */}
      <motion.path
        d="M 160 0
           L 160 30
           L 140 30
           L 140 55
           L 180 55
           L 180 80
           L 140 80
           L 140 105
           L 180 105
           L 180 130
           L 160 130
           L 160 155
           L 160 185
           L 160 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-completed)"
        style={{ pathLength: flowThrough }}
      />

      {/* Ground line */}
      <motion.line x1="40" y1="185" x2="280" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
        style={{ pathLength: ground }} />

      {/* === MAIN BUILDING STRUCTURE === */}

      {/* Building outline - clean modern lines */}
      <motion.path
        d="M 80 185 L 80 30 L 240 30 L 240 185"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        style={{ pathLength: structure }}
      />

      {/* Roof detail */}
      <motion.path
        d="M 75 30 L 245 30 M 80 25 L 240 25"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        style={{ pathLength: structure }}
      />

      {/* Floor lines - clean and level */}
      <motion.g style={{ opacity: floors }}>
        <line x1="80" y1="55" x2="240" y2="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="80" y1="80" x2="240" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="80" y1="105" x2="240" y2="105" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="80" y1="130" x2="240" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="80" y1="155" x2="240" y2="155" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </motion.g>

      {/* Windows - lit and uniform */}
      <motion.g style={{ opacity: windows }}>
        {/* Row 1 - Penthouse */}
        <rect x="95" y="35" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="125" y="35" width="18" height="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="155" y="35" width="18" height="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="185" y="35" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="215" y="35" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Row 2 */}
        <rect x="95" y="60" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="125" y="60" width="18" height="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="155" y="60" width="18" height="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="185" y="60" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="215" y="60" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Row 3 */}
        <rect x="95" y="85" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="125" y="85" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="155" y="85" width="18" height="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="185" y="85" width="18" height="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="215" y="85" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Row 4 */}
        <rect x="95" y="110" width="18" height="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="125" y="110" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="155" y="110" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="185" y="110" width="18" height="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="215" y="110" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Row 5 */}
        <rect x="95" y="135" width="18" height="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="125" y="135" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="155" y="135" width="18" height="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="185" y="135" width="18" height="15" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="215" y="135" width="18" height="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </motion.g>

      {/* Building details - reveals polish */}
      <motion.g style={{ opacity: details }}>
        {/* Vertical accent lines */}
        <line x1="80" y1="30" x2="80" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <line x1="240" y1="30" x2="240" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

        {/* Crown/parapet detail */}
        <path d="M 80 30 L 80 22 L 90 22 M 230 22 L 240 22 L 240 30"
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* Decorative elements on facade */}
        <line x1="90" y1="30" x2="90" y2="155" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="230" y1="30" x2="230" y2="155" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </motion.g>

      {/* Grand entrance */}
      <motion.g style={{ opacity: entrance }}>
        {/* Entrance canopy */}
        <path d="M 130 160 L 130 155 L 190 155 L 190 160"
          fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

        {/* Double doors */}
        <rect x="140" y="160" width="18" height="25" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="162" y="160" width="18" height="25" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

        {/* Door handles */}
        <line x1="155" y1="170" x2="155" y2="178" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="165" y1="170" x2="165" y2="178" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Steps */}
        <line x1="135" y1="185" x2="185" y2="185" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="138" y1="188" x2="182" y2="188" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      </motion.g>

      {/* Finishing touches - landscaping and people */}
      <motion.g style={{ opacity: finishing }}>
        {/* Flag pole on roof */}
        <line x1="160" y1="22" x2="160" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M 160 8 L 172 11 L 160 14" fill="rgba(255,255,255,0.15)" stroke="none" />

        {/* Planters */}
        <rect x="50" y="175" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <ellipse cx="60" cy="172" rx="8" ry="4" fill="rgba(255,255,255,0.08)" />

        <rect x="250" y="175" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <ellipse cx="260" cy="172" rx="8" ry="4" fill="rgba(255,255,255,0.08)" />

        {/* People silhouettes near entrance */}
        <ellipse cx="120" cy="182" rx="3" ry="3" fill="rgba(255,255,255,0.15)" />
        <line x1="120" y1="185" x2="120" y2="193" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

        <ellipse cx="200" cy="181" rx="3" ry="3" fill="rgba(255,255,255,0.12)" />
        <line x1="200" y1="184" x2="200" y2="192" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* Company sign above entrance */}
        <rect x="145" y="152" width="30" height="3" fill="rgba(255,255,255,0.2)" />
      </motion.g>
    </motion.svg>
  );
}

// Document with signature - represents closing a deal/finding a project
function DocumentSignatureGraphic({ scrollProgress }: GraphicProps) {
  const flowThrough = useScrollTransform(scrollProgress, 0.08, 0.78);
  const ground = useScrollTransform(scrollProgress, 0.10, 0.18);
  const desk = useScrollTransform(scrollProgress, 0.14, 0.26);
  const document = useScrollTransform(scrollProgress, 0.20, 0.36);
  const headerLine = useScrollTransform(scrollProgress, 0.28, 0.40);
  const textLines = useScrollTransform(scrollProgress, 0.34, 0.50);
  const checkbox = useScrollTransform(scrollProgress, 0.44, 0.54);
  const signatureLine = useScrollTransform(scrollProgress, 0.48, 0.58);
  const signature = useScrollTransform(scrollProgress, 0.54, 0.72);
  const pen = useScrollTransform(scrollProgress, 0.58, 0.68);
  const stamp = useScrollTransform(scrollProgress, 0.64, 0.76);
  const finishing = useScrollTransform(scrollProgress, 0.70, 0.82);

  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full gpu-accelerated">
      <defs>
        <filter id="glow-document" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Flow line - splits around outside of document, meets at bottom */}
      {/* Left side path: top center -> split left -> down left side -> bottom center */}
      <motion.path
        d="M 160 0
           L 160 20
           L 75 20
           L 75 180
           L 160 180"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-document)"
        style={{ pathLength: flowThrough }}
      />
      {/* Right side path: top center -> split right -> down right side -> bottom center */}
      <motion.path
        d="M 160 0
           L 160 20
           L 245 20
           L 245 180
           L 160 180"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-document)"
        style={{ pathLength: flowThrough }}
      />
      {/* Exit line from bottom center */}
      <motion.path
        d="M 160 180
           L 160 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-document)"
        style={{ pathLength: flowThrough }}
      />

      {/* Ground/table surface */}
      <motion.line x1="40" y1="185" x2="280" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
        style={{ pathLength: ground }} />

      {/* Desk surface */}
      <motion.g style={{ opacity: desk }}>
        <rect x="60" y="175" width="200" height="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Desk edge detail */}
        <line x1="60" y1="175" x2="260" y2="175" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      </motion.g>

      {/* Main document paper */}
      <motion.g style={{ opacity: document }}>
        {/* Document shadow */}
        <rect x="88" y="33" width="144" height="145" fill="rgba(0,0,0,0.1)" />
        {/* Document paper */}
        <rect x="85" y="30" width="150" height="145" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        {/* Paper corner fold */}
        <path d="M 215 30 L 235 30 L 235 50 L 215 50 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <path d="M 215 30 L 215 50 L 235 50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </motion.g>

      {/* Document header/title */}
      <motion.g style={{ opacity: headerLine }}>
        {/* Header bar */}
        <rect x="100" y="40" width="120" height="12" fill="rgba(255,255,255,0.12)" />
        {/* Company logo placeholder */}
        <rect x="105" y="43" width="20" height="6" fill="rgba(255,255,255,0.15)" />
        {/* Title text line */}
        <rect x="130" y="44" width="60" height="4" fill="rgba(255,255,255,0.1)" />
      </motion.g>

      {/* Document text lines */}
      <motion.g style={{ opacity: textLines }}>
        {/* Section 1 */}
        <rect x="100" y="60" width="110" height="3" fill="rgba(255,255,255,0.08)" />
        <rect x="100" y="67" width="100" height="2" fill="rgba(255,255,255,0.06)" />
        <rect x="100" y="73" width="115" height="2" fill="rgba(255,255,255,0.06)" />
        <rect x="100" y="79" width="90" height="2" fill="rgba(255,255,255,0.06)" />

        {/* Section 2 */}
        <rect x="100" y="90" width="105" height="3" fill="rgba(255,255,255,0.08)" />
        <rect x="100" y="97" width="110" height="2" fill="rgba(255,255,255,0.06)" />
        <rect x="100" y="103" width="95" height="2" fill="rgba(255,255,255,0.06)" />
        <rect x="100" y="109" width="108" height="2" fill="rgba(255,255,255,0.06)" />

        {/* Terms/conditions small text */}
        <rect x="100" y="120" width="118" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="100" y="124" width="112" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="100" y="128" width="100" height="1.5" fill="rgba(255,255,255,0.04)" />
      </motion.g>

      {/* Checkbox/agreement box */}
      <motion.g style={{ opacity: checkbox }}>
        <rect x="100" y="135" width="8" height="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Checkmark */}
        <motion.path
          d="M 101 139 L 104 142 L 107 136"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: checkbox }}
        />
        {/* Agreement text */}
        <rect x="112" y="137" width="80" height="2" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      {/* Signature line */}
      <motion.g style={{ opacity: signatureLine }}>
        <line x1="100" y1="160" x2="180" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* "Sign here" label */}
        <rect x="100" y="163" width="30" height="2" fill="rgba(255,255,255,0.06)" />
        {/* Date line */}
        <line x1="195" y1="160" x2="225" y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <rect x="195" y="163" width="15" height="2" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      {/* Signature - cursive flowing line */}
      <motion.path
        d="M 105 158
           Q 110 152, 118 155
           Q 125 158, 128 150
           Q 132 144, 140 152
           Q 145 158, 150 148
           Q 155 142, 162 150
           Q 168 156, 175 152"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: signature }}
      />

      {/* Date written */}
      <motion.g style={{ opacity: signature }}>
        <text x="200" y="158" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="serif">2024</text>
      </motion.g>

      {/* Pen */}
      <motion.g style={{ opacity: pen }}>
        {/* Pen body */}
        <rect x="175" y="145" width="35" height="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" rx="1" transform="rotate(-25 192 147)" />
        {/* Pen tip */}
        <path d="M 178 157 L 175 162 L 180 159 Z" fill="rgba(255,255,255,0.25)" />
        {/* Pen clip */}
        <rect x="200" y="143" width="8" height="2" fill="rgba(255,255,255,0.2)" transform="rotate(-25 204 144)" />
      </motion.g>

      {/* Official stamp/seal */}
      <motion.g style={{ opacity: stamp }}>
        {/* Stamp circle */}
        <circle cx="205" y="95" r="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        {/* Inner circle */}
        <circle cx="205" cy="95" r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        {/* Star/seal design in center */}
        <motion.path
          d="M 205 87 L 207 92 L 213 92 L 209 96 L 211 102 L 205 99 L 199 102 L 201 96 L 197 92 L 203 92 Z"
          fill="rgba(255,255,255,0.2)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.5"
          style={{ scale: stamp }}
        />
      </motion.g>

      {/* Second document underneath (deal papers stack) */}
      <motion.g style={{ opacity: finishing }}>
        <rect x="78" y="35" width="145" height="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <rect x="72" y="40" width="145" height="135" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      </motion.g>

      {/* Key on desk - symbolic of unlocking value */}
      <motion.g style={{ opacity: finishing }}>
        {/* Key body */}
        <rect x="245" y="165" width="20" height="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" rx="1" />
        {/* Key bow (handle) */}
        <circle cx="270" cy="168" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="270" cy="168" r="3" fill="rgba(255,255,255,0.08)" />
        {/* Key teeth */}
        <path d="M 245 168 L 243 168 L 243 172 L 246 172 L 246 170 L 248 170 L 248 172 L 251 172 L 251 168"
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </motion.g>

      {/* Handshake silhouette in background */}
      <motion.g style={{ opacity: finishing }}>
        <path
          d="M 45 155
             Q 50 150, 55 152
             L 65 145
             Q 70 142, 75 145
             L 80 150
             Q 85 155, 80 160
             L 70 165
             Q 65 168, 60 165
             L 50 158
             Q 45 155, 45 155"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <path
          d="M 55 155
             Q 60 158, 65 155
             L 75 148"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />
      </motion.g>

      {/* Additional papers/folder on desk */}
      <motion.g style={{ opacity: desk }}>
        <rect x="250" y="145" width="25" height="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" transform="rotate(5 262 160)" />
        <rect x="252" y="147" width="25" height="30" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" transform="rotate(3 265 162)" />
      </motion.g>
    </motion.svg>
  );
}
