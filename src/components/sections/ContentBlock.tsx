import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "../ui/ScrollReveal";

interface ContentBlockProps {
  text: string;
  graphic?: "ukSkyline" | "blueprint" | "framework" | "crossSection";
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

function GraphicElement({ variant }: { variant: "ukSkyline" | "blueprint" | "framework" | "crossSection" }) {
  const isWide = variant === "crossSection";
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
      {variant === "ukSkyline" && <UKSkylineGraphic scrollProgress={scrollYProgress} />}
      {variant === "blueprint" && <BlueprintGraphic scrollProgress={scrollYProgress} />}
      {variant === "framework" && <FrameworkGraphic scrollProgress={scrollYProgress} />}
      {variant === "crossSection" && <CrossSectionGraphic scrollProgress={scrollYProgress} />}
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

// UK City Skyline - Big Ben, Georgian townhouses, Shard, St Paul's, Gherkin
function UKSkylineGraphic({ scrollProgress }: GraphicProps) {
  // Flow line - starts bottom-left, traces roofline, exits center-bottom
  const flowThrough = useScrollTransform(scrollProgress, 0.08, 0.78);

  // Animation sequence: left to right, top to bottom within each building
  const ground = useScrollTransform(scrollProgress, 0.10, 0.20);
  const bigBen = useScrollTransform(scrollProgress, 0.12, 0.32);
  const bigBenDetails = useScrollTransform(scrollProgress, 0.28, 0.40);
  const townhouses = useScrollTransform(scrollProgress, 0.20, 0.38);
  const townhouseDetails = useScrollTransform(scrollProgress, 0.34, 0.46);
  const shard = useScrollTransform(scrollProgress, 0.26, 0.44);
  const shardDetails = useScrollTransform(scrollProgress, 0.40, 0.52);
  const stPauls = useScrollTransform(scrollProgress, 0.32, 0.50);
  const stPaulsDetails = useScrollTransform(scrollProgress, 0.46, 0.58);
  const gherkin = useScrollTransform(scrollProgress, 0.38, 0.56);
  const gherkinDetails = useScrollTransform(scrollProgress, 0.52, 0.64);
  const officeBlock = useScrollTransform(scrollProgress, 0.44, 0.62);
  const officeDetails = useScrollTransform(scrollProgress, 0.58, 0.70);
  const lights = useScrollTransform(scrollProgress, 0.65, 0.78);

  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="glow-uk" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* FLOW LINE - enters bottom-left, traces roofline, exits center */}
      <motion.path
        d="M 0 185
           L 20 185
           L 20 25
           L 28 18
           L 28 25
           L 35 40
           L 55 40
           L 55 65
           L 85 65
           L 95 15
           L 105 65
           L 115 55
           L 130 55
           L 135 80
           L 150 45
           L 165 80
           L 175 60
           L 185 80
           L 185 185
           L 100 185
           L 100 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-uk)"
        style={{ pathLength: flowThrough }}
      />

      {/* Ground line */}
      <motion.line
        x1="5" y1="185" x2="195" y2="185"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        style={{ pathLength: ground }}
      />

      {/* === BIG BEN (Victorian Clock Tower) - Left === */}
      <motion.path
        d="M 20 185 L 20 45 L 24 40 L 28 18 L 32 40 L 36 45 L 36 185"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        style={{ pathLength: bigBen }}
      />
      {/* Clock face */}
      <motion.circle cx="28" cy="55" r="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"
        style={{ pathLength: bigBenDetails }} />
      <motion.g style={{ opacity: bigBenDetails }}>
        <line x1="28" y1="51" x2="28" y2="55" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="28" y1="55" x2="31" y2="57" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </motion.g>
      {/* Tower details */}
      <motion.g style={{ opacity: bigBenDetails }}>
        <line x1="20" y1="70" x2="36" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="100" x2="36" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="130" x2="36" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="160" x2="36" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        {/* Windows */}
        {[80, 110, 140, 170].map((y, i) => (
          <rect key={`bb-w-${i}`} x="24" y={y} width="8" height="6" fill="rgba(255,255,255,0.08)" />
        ))}
      </motion.g>
      {/* Spire */}
      <motion.line x1="28" y1="18" x2="28" y2="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
        style={{ pathLength: bigBen }} />

      {/* === GEORGIAN TOWNHOUSES === */}
      <motion.path
        d="M 42 185 L 42 65 L 48 55 L 54 65 L 54 185
           M 54 185 L 54 70 L 60 60 L 66 70 L 66 185
           M 66 185 L 66 68 L 72 58 L 78 68 L 78 185"
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1"
        style={{ pathLength: townhouses }}
      />
      {/* Chimneys */}
      <motion.g style={{ opacity: townhouseDetails }}>
        <rect x="44" y="52" width="3" height="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <rect x="56" y="57" width="3" height="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <rect x="68" y="55" width="3" height="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      </motion.g>
      {/* Windows and doors */}
      <motion.g style={{ opacity: townhouseDetails }}>
        {/* House 1 */}
        <rect x="44" y="80" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="44" y="100" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="44" y="120" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="46" y="170" width="4" height="15" fill="rgba(255,255,255,0.08)" />
        {/* House 2 */}
        <rect x="56" y="85" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="56" y="105" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="56" y="125" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="58" y="170" width="4" height="15" fill="rgba(255,255,255,0.08)" />
        {/* House 3 */}
        <rect x="68" y="83" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="68" y="103" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="68" y="123" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="70" y="170" width="4" height="15" fill="rgba(255,255,255,0.08)" />
      </motion.g>

      {/* === THE SHARD === */}
      <motion.path
        d="M 95 15 L 85 185 M 95 15 L 105 185 M 95 15 L 95 185"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        style={{ pathLength: shard }}
      />
      {/* Shard horizontal lines */}
      <motion.g style={{ opacity: shardDetails }}>
        {[40, 60, 80, 100, 120, 140, 160].map((y, i) => {
          const width = (185 - y) * 0.11;
          return (
            <line key={`sh-${i}`} x1={95 - width} y1={y} x2={95 + width} y2={y}
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          );
        })}
      </motion.g>

      {/* === ST PAUL'S DOME === */}
      <motion.path
        d="M 115 185 L 115 90 L 118 85 L 118 75
           M 140 185 L 140 90 L 137 85 L 137 75
           M 118 75 Q 127.5 50, 137 75"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        style={{ pathLength: stPauls }}
      />
      {/* Dome lantern/cross */}
      <motion.g style={{ opacity: stPaulsDetails }}>
        <line x1="127.5" y1="50" x2="127.5" y2="42" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="124" y1="45" x2="131" y2="45" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        {/* Columns */}
        <line x1="118" y1="90" x2="118" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="124" y1="90" x2="124" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="131" y1="90" x2="131" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="137" y1="90" x2="137" y2="185" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        {/* Horizontal bands */}
        <line x1="115" y1="120" x2="140" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <line x1="115" y1="150" x2="140" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </motion.g>

      {/* === GHERKIN (30 St Mary Axe) === */}
      <motion.path
        d="M 150 185 L 150 90 Q 150 45, 160 45 Q 170 45, 170 90 L 170 185"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        style={{ pathLength: gherkin }}
      />
      {/* Diagonal lattice pattern */}
      <motion.g style={{ opacity: gherkinDetails }}>
        {[60, 80, 100, 120, 140, 160].map((y, i) => {
          const squeeze = Math.min(1, (y - 45) / 45);
          const halfWidth = 10 * squeeze;
          return (
            <g key={`gh-${i}`}>
              <line x1={160 - halfWidth} y1={y} x2={160 + halfWidth} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <line x1={160 - halfWidth * 0.7} y1={y - 8} x2={160 + halfWidth * 0.7} y2={y + 8}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
              <line x1={160 + halfWidth * 0.7} y1={y - 8} x2={160 - halfWidth * 0.7} y2={y + 8}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
            </g>
          );
        })}
      </motion.g>

      {/* === MODERN OFFICE BLOCK (Stepped Art Deco) === */}
      <motion.path
        d="M 175 185 L 175 100 L 178 95 L 178 80 L 182 75 L 182 60 L 188 60 L 188 75 L 192 80 L 192 95 L 195 100 L 195 185"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        style={{ pathLength: officeBlock }}
      />
      {/* Office windows grid */}
      <motion.g style={{ opacity: officeDetails }}>
        {[110, 130, 150, 170].map((y, i) => (
          <g key={`of-${i}`}>
            <rect x="177" y={y} width="4" height="5" fill="rgba(255,255,255,0.06)" />
            <rect x="183" y={y} width="4" height="5" fill="rgba(255,255,255,0.06)" />
            <rect x="189" y={y} width="4" height="5" fill="rgba(255,255,255,0.06)" />
          </g>
        ))}
        <rect x="183" y="85" width="4" height="5" fill="rgba(255,255,255,0.06)" />
        <rect x="183" y="68" width="4" height="4" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      {/* Beacon lights */}
      <motion.g style={{ opacity: lights }}>
        <circle cx="28" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="95" cy="15" r="2.5" fill="rgba(255,255,255,0.6)" />
        <circle cx="127.5" cy="42" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="160" cy="45" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="185" cy="60" r="1" fill="rgba(255,255,255,0.3)" />
      </motion.g>
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
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="glow-blueprint" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="glow-framework" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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

// Building Cross-Section - Shows multiple floors with interior details
function CrossSectionGraphic({ scrollProgress }: GraphicProps) {
  const flowThrough = useScrollTransform(scrollProgress, 0.08, 0.78);
  const foundation = useScrollTransform(scrollProgress, 0.10, 0.22);
  const structure = useScrollTransform(scrollProgress, 0.16, 0.40);
  const floors = useScrollTransform(scrollProgress, 0.28, 0.48);
  const walls = useScrollTransform(scrollProgress, 0.36, 0.52);
  const windows = useScrollTransform(scrollProgress, 0.44, 0.58);
  const furniture = useScrollTransform(scrollProgress, 0.50, 0.64);
  const people = useScrollTransform(scrollProgress, 0.56, 0.68);
  const roof = useScrollTransform(scrollProgress, 0.62, 0.74);
  const details = useScrollTransform(scrollProgress, 0.68, 0.80);

  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full">
      <defs>
        <filter id="glow-cross" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Flow line - enters top, flows through building, exits bottom */}
      <motion.path
        d="M 160 0
           L 160 20
           L 60 20
           L 60 45
           L 100 45
           L 100 80
           L 140 80
           L 140 115
           L 180 115
           L 180 150
           L 220 150
           L 220 185
           L 160 185
           L 160 200"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow-cross)"
        style={{ pathLength: flowThrough }}
      />

      {/* Foundation/Underground */}
      <motion.g style={{ opacity: foundation }}>
        <rect x="50" y="180" width="220" height="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="50" y1="188" x2="270" y2="188" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4,2" />
        {/* Underground parking */}
        <rect x="70" y="182" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="100" y="182" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="200" y="182" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="230" y="182" width="20" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </motion.g>

      {/* Main building structure */}
      <motion.path
        d="M 50 180 L 50 25 L 270 25 L 270 180"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        style={{ pathLength: structure }}
      />

      {/* Floor slabs */}
      <motion.g style={{ opacity: floors }}>
        {[45, 80, 115, 150].map((y, i) => (
          <g key={`floor-${i}`}>
            <line x1="50" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            {/* Floor beams */}
            <line x1="50" y1={y + 2} x2="270" y2={y + 2} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </g>
        ))}
      </motion.g>

      {/* Interior walls */}
      <motion.g style={{ opacity: walls }}>
        {/* Floor 1 (top) - offices */}
        <line x1="110" y1="25" x2="110" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="160" y1="25" x2="160" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="210" y1="25" x2="210" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Floor 2 */}
        <line x1="100" y1="45" x2="100" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="160" y1="45" x2="160" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="220" y1="45" x2="220" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Floor 3 */}
        <line x1="90" y1="80" x2="90" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="140" y1="80" x2="140" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="190" y1="80" x2="190" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="230" y1="80" x2="230" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Floor 4 (ground) - lobby/retail */}
        <line x1="120" y1="115" x2="120" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="200" y1="115" x2="200" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Basement */}
        <line x1="160" y1="150" x2="160" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </motion.g>

      {/* Windows (exterior) */}
      <motion.g style={{ opacity: windows }}>
        {/* Left side windows */}
        {[32, 58, 93, 128].map((y, i) => (
          <rect key={`lw-${i}`} x="50" y={y} width="3" height="8" fill="rgba(255,255,255,0.12)" />
        ))}
        {/* Right side windows */}
        {[32, 58, 93, 128].map((y, i) => (
          <rect key={`rw-${i}`} x="267" y={y} width="3" height="8" fill="rgba(255,255,255,0.12)" />
        ))}
        {/* Top floor windows */}
        {[65, 85, 135, 155, 185, 205, 235, 255].map((x, i) => (
          <rect key={`tw-${i}`} x={x} y="28" width="8" height="12" fill="rgba(255,255,255,0.08)" />
        ))}
      </motion.g>

      {/* Furniture/Interior details */}
      <motion.g style={{ opacity: furniture }}>
        {/* Top floor - desks */}
        <rect x="60" y="38" width="12" height="4" fill="rgba(255,255,255,0.06)" />
        <rect x="120" y="38" width="12" height="4" fill="rgba(255,255,255,0.06)" />
        <rect x="170" y="38" width="12" height="4" fill="rgba(255,255,255,0.06)" />
        <rect x="220" y="38" width="12" height="4" fill="rgba(255,255,255,0.06)" />
        {/* Floor 2 - meeting rooms */}
        <rect x="55" y="65" width="35" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="165" y="65" width="45" height="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        {/* Floor 3 - open plan */}
        <rect x="55" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        <rect x="70" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        <rect x="145" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        <rect x="160" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        <rect x="195" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        <rect x="235" y="100" width="8" height="4" fill="rgba(255,255,255,0.05)" />
        {/* Ground floor - lobby */}
        <circle cx="160" cy="132" r="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <rect x="55" y="125" width="50" height="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="215" y="125" width="45" height="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </motion.g>

      {/* People silhouettes */}
      <motion.g style={{ opacity: people }}>
        {/* Simple person shapes */}
        {[[75, 36], [130, 36], [180, 36], [65, 63], [200, 63], [60, 98], [155, 98], [240, 98], [80, 130], [240, 130]].map(([x, y], i) => (
          <g key={`person-${i}`}>
            <circle cx={x} cy={y} r="2" fill="rgba(255,255,255,0.15)" />
            <line x1={x} y1={y + 2} x2={x} y2={y + 6} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          </g>
        ))}
      </motion.g>

      {/* Roof structure */}
      <motion.g style={{ opacity: roof }}>
        <line x1="50" y1="25" x2="50" y2="18" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="270" y1="25" x2="270" y2="18" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="50" y1="18" x2="270" y2="18" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Mechanical equipment */}
        <rect x="100" y="10" width="25" height="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <rect x="200" y="10" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        {/* Elevator shaft */}
        <rect x="155" y="8" width="10" height="17" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.g>

      {/* Final details - stairs, elevator */}
      <motion.g style={{ opacity: details }}>
        {/* Elevator shaft through building */}
        <rect x="155" y="25" width="10" height="155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2,2" />
        <rect x="156" y="60" width="8" height="10" fill="rgba(255,255,255,0.08)" />
        {/* Stairwell */}
        <g>
          {[30, 65, 100, 135].map((y, i) => (
            <g key={`stairs-${i}`}>
              <line x1="245" y1={y} x2="265" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <line x1="245" y1={y} x2="245" y2={y + 30} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <line x1="265" y1={y} x2="265" y2={y + 30} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              {[0, 5, 10, 15, 20, 25].map((offset, j) => (
                <line key={`step-${i}-${j}`} x1="247" y1={y + offset} x2="263" y2={y + offset}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              ))}
            </g>
          ))}
        </g>
        {/* Floor labels */}
        {[35, 62, 97, 132, 165].map((y, i) => (
          <rect key={`flabel-${i}`} x="52" y={y} width="6" height="6" fill="rgba(255,255,255,0.06)" />
        ))}
        {/* Main entrance */}
        <rect x="145" y="145" width="30" height="5" fill="rgba(255,255,255,0.1)" />
        <line x1="160" y1="150" x2="160" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  );
}
