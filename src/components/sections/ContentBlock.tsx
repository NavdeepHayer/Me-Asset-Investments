import { motion } from "framer-motion";
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
      <section className={`py-16 md:py-24 lg:py-32 ${className}`}>
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
          <div className={`flex flex-col ${graphicPosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-16 xl:gap-24 2xl:gap-32 items-center`}>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={isWide
        ? "w-[320px] h-[200px] md:w-[480px] md:h-[300px] lg:w-[600px] lg:h-[380px] xl:w-[700px] xl:h-[440px] 2xl:w-[800px] 2xl:h-[500px]"
        : "w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] 2xl:w-[580px] 2xl:h-[580px]"
      }
    >
      {variant === "crane" && <CraneGraphic />}
      {variant === "blueprint" && <BlueprintGraphic />}
      {variant === "framework" && <FrameworkGraphic />}
      {variant === "skyline" && <SkylineGraphic />}
    </motion.div>
  );
}

// Tower crane with detailed lattice structure
function CraneGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Ground and construction site base */}
      <motion.line
        x1="10" y1="185" x2="190" y2="185"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Crane base/foundation */}
      <motion.path
        d="M 80 185 L 80 175 L 120 175 L 120 185 M 85 175 L 85 170 L 115 170 L 115 175"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Main tower - left rail */}
      <motion.line
        x1="92" y1="170" x2="92" y2="38"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />
      {/* Main tower - right rail */}
      <motion.line
        x1="108" y1="170" x2="108" y2="38"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />

      {/* Tower lattice cross-bracing - detailed */}
      {[165, 150, 135, 120, 105, 90, 75, 60, 45].map((y, i) => (
        <motion.path
          key={`lattice-${i}`}
          d={`M 92 ${y} L 108 ${y - 12} M 108 ${y} L 92 ${y - 12} M 92 ${y - 6} L 108 ${y - 6}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.8 + i * 0.08 }}
        />
      ))}

      {/* Slewing unit (turntable) */}
      <motion.rect
        x="88" y="35" width="24" height="8"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.5"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.5 }}
      />

      {/* Operator cabin */}
      <motion.path
        d="M 94 35 L 94 26 L 106 26 L 106 35 M 96 32 L 104 32"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.6 }}
      />

      {/* Main jib (horizontal boom) - top chord */}
      <motion.line
        x1="100" y1="28" x2="175" y2="28"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
      />
      {/* Main jib - bottom chord */}
      <motion.line
        x1="100" y1="35" x2="175" y2="35"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.9, ease: "easeOut" }}
      />
      {/* Jib lattice */}
      {[115, 130, 145, 160].map((x, i) => (
        <motion.path
          key={`jib-lat-${i}`}
          d={`M ${x} 28 L ${x} 35 M ${x - 7} 28 L ${x} 35 M ${x} 28 L ${x + 7} 35`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 2.1 + i * 0.1 }}
        />
      ))}
      {/* Jib tip */}
      <motion.path
        d="M 175 28 L 178 31 L 175 35"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, delay: 2.5 }}
      />

      {/* Counter-jib */}
      <motion.line
        x1="100" y1="30" x2="45" y2="30"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2 }}
      />
      {/* Counterweights */}
      {[52, 60, 68].map((x, i) => (
        <motion.rect
          key={`cw-${i}`}
          x={x} y="30" width="6" height="10"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          initial={{ opacity: 0, y: -5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.3 + i * 0.1 }}
        />
      ))}

      {/* Tower peak / A-frame */}
      <motion.path
        d="M 92 38 L 100 18 L 108 38 M 96 28 L 100 18 L 104 28"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2.6 }}
      />

      {/* Pendant lines (cables from peak to jib) */}
      <motion.path
        d="M 100 18 L 140 28 M 100 18 L 175 28"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 2.8 }}
      />
      {/* Counter-jib pendant */}
      <motion.line
        x1="100" y1="18" x2="50" y2="30"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 2.9 }}
      />

      {/* Trolley */}
      <motion.rect
        x="148" y="34" width="8" height="4"
        fill="rgba(255,255,255,0.15)"
        initial={{ x: 115 }}
        whileInView={{ x: 148 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 3.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Hook block and cable */}
      <motion.path
        d="M 152 38 L 152 95 M 149 95 L 155 95 L 155 100 Q 152 105, 149 100 L 149 95"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 3.5 }}
      />

      {/* Load (steel beam) */}
      <motion.g
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 4, ease: "easeOut" }}
      >
        <rect x="140" y="108" width="24" height="4" fill="rgba(255,255,255,0.12)" />
        <line x1="140" y1="108" x2="140" y2="112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="164" y1="108" x2="164" y2="112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Rigging lines */}
        <line x1="145" y1="105" x2="152" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="159" y1="105" x2="152" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.g>

      {/* Building under construction (background) */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        <line x1="25" y1="185" x2="25" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="55" y1="185" x2="55" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="25" y1="160" x2="55" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="25" y1="140" x2="55" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </motion.g>

      {/* Warning light */}
      <motion.circle
        cx="100" cy="18" r="2"
        fill="rgba(255,255,255,0.5)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 3, repeat: Infinity, repeatDelay: 0.5 }}
      />
    </motion.svg>
  );
}

// Architectural blueprint with grid and details
function BlueprintGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Background grid */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`vg-${i}`} x1={20 + i * 16} y1="20" x2={20 + i * 16} y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line key={`hg-${i}`} x1="20" y1={20 + i * 16} x2="180" y2={20 + i * 16} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
      </motion.g>

      {/* Main building outline - thick walls */}
      <motion.path
        d="M 30 30 L 170 30 L 170 170 L 30 170 Z"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Interior walls */}
      <motion.path
        d="M 90 30 L 90 110 M 30 85 L 90 85 M 90 130 L 170 130 M 130 85 L 130 170"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      {/* Door openings with swing arcs */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8 }}
      >
        {/* Door 1 - top left room */}
        <path d="M 55 85 L 55 75" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 55 85 A 10 10 0 0 0 65 85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />

        {/* Door 2 - entrance */}
        <path d="M 90 150 L 90 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 90 150 A 10 10 0 0 1 100 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />

        {/* Door 3 - right side */}
        <path d="M 130 105 L 130 95" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M 130 105 A 10 10 0 0 1 140 105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,1" />
      </motion.g>

      {/* Windows on exterior walls */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.2 }}
      >
        {/* Top windows */}
        {[50, 75, 120, 145].map((x, i) => (
          <g key={`tw-${i}`}>
            <line x1={x} y1="30" x2={x + 15} y2="30" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1={x} y1="26" x2={x} y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1={x + 15} y1="26" x2={x + 15} y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
        {/* Left windows */}
        {[50, 100, 145].map((y, i) => (
          <g key={`lw-${i}`}>
            <line x1="30" y1={y} x2="30" y2={y + 15} stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1="26" y1={y} x2="30" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="26" y1={y + 15} x2="30" y2={y + 15} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
        {/* Right windows */}
        {[50, 145].map((y, i) => (
          <g key={`rw-${i}`}>
            <line x1="170" y1={y} x2="170" y2={y + 15} stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <line x1="170" y1={y} x2="174" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="170" y1={y + 15} x2="174" y2={y + 15} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </g>
        ))}
      </motion.g>

      {/* Stairs symbol */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.5 }}
      >
        {[0, 3, 6, 9, 12, 15, 18].map((offset, i) => (
          <line key={`stair-${i}`} x1={140 + offset} y1="140" x2={140 + offset} y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        ))}
        <path d="M 138 140 L 160 140 L 160 160 L 138 160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <path d="M 140 150 L 158 150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </motion.g>

      {/* Kitchen fixtures */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.8 }}
      >
        {/* Counter */}
        <rect x="95" y="35" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        {/* Sink */}
        <rect x="100" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
        {/* Stove */}
        <rect x="115" y="36" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <circle cx="117" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
        <circle cx="121" cy="39" r="1" fill="rgba(255,255,255,0.06)" />
      </motion.g>

      {/* Bathroom fixtures */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 3 }}
      >
        {/* Toilet */}
        <ellipse cx="40" cy="100" rx="4" ry="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="37" y="96" width="6" height="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        {/* Sink */}
        <rect x="50" y="90" width="8" height="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="1" />
      </motion.g>

      {/* Dimension lines */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 3.2 }}
      >
        {/* Bottom dimension */}
        <line x1="30" y1="185" x2="170" y2="185" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="30" y1="183" x2="30" y2="187" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="170" y1="183" x2="170" y2="187" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="100" y1="183" x2="100" y2="187" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        {/* Left dimension */}
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
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 3.4 + i * 0.1 }}
        />
      ))}

      {/* North arrow */}
      <motion.g
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 3.6, type: "spring" }}
      >
        <circle cx="160" cy="55" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <path d="M 160 47 L 160 63 M 155 52 L 160 47 L 165 52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="160" cy="47" r="1.5" fill="rgba(255,255,255,0.15)" />
      </motion.g>

      {/* Scale bar */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 3.8 }}
      >
        <rect x="35" y="180" width="30" height="2" fill="rgba(255,255,255,0.1)" />
        <rect x="35" y="180" width="15" height="2" fill="rgba(255,255,255,0.15)" />
      </motion.g>
    </motion.svg>
  );
}

// Steel frame structure with detailed I-beams
function FrameworkGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Ground */}
      <motion.line
        x1="15" y1="180" x2="185" y2="180"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />

      {/* Foundation */}
      <motion.path
        d="M 30 180 L 30 175 L 170 175 L 170 180 M 35 175 L 35 172 L 165 172 L 165 175"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Main columns - I-beam profile */}
      {[40, 80, 120, 160].map((x, i) => (
        <motion.g key={`col-${i}`}>
          {/* Column main line */}
          <motion.line
            x1={x} y1="172" x2={x} y2="22"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
          />
          {/* I-beam flanges (top and bottom of each section) */}
          {[172, 142, 112, 82, 52, 22].map((y, j) => (
            <motion.line
              key={`flange-${i}-${j}`}
              x1={x - 4} y1={y} x2={x + 4} y2={y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 1.2 + i * 0.15 + j * 0.05 }}
            />
          ))}
        </motion.g>
      ))}

      {/* Floor beams */}
      {[142, 112, 82, 52, 22].map((y, i) => (
        <motion.g key={`floor-${i}`}>
          <motion.line
            x1="40" y1={y} x2="160" y2={y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.5 + i * 0.15 }}
          />
          {/* Web stiffeners */}
          {[55, 70, 95, 105, 135, 150].map((x, j) => (
            <motion.line
              key={`stiff-${i}-${j}`}
              x1={x} y1={y - 2} x2={x} y2={y + 2}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, delay: 1.8 + i * 0.1 + j * 0.02 }}
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
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2.5 }}
      />
      <motion.path
        d="M 40 82 L 80 52 M 80 82 L 40 52"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2.7 }}
      />
      <motion.path
        d="M 120 142 L 160 112 M 160 142 L 120 112"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2.9 }}
      />
      <motion.path
        d="M 120 82 L 160 52 M 160 82 L 120 52"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 3.1 }}
      />

      {/* Connection plates (gusset plates at intersections) */}
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
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15, delay: 3.3 + i * 0.02 }}
        />
      ))}

      {/* Bolt patterns on gusset plates */}
      {[[40, 112], [80, 82], [120, 112], [160, 82]].map(([x, y], i) => (
        <motion.g key={`bolts-${i}`}>
          {[[-2, -2], [2, -2], [-2, 2], [2, 2]].map(([dx, dy], j) => (
            <motion.circle
              key={`bolt-${i}-${j}`}
              cx={x + dx} cy={y + dy} r="0.8"
              fill="rgba(255,255,255,0.2)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.1, delay: 3.6 + i * 0.1 + j * 0.03 }}
            />
          ))}
        </motion.g>
      ))}

      {/* Scaffolding on left side */}
      <motion.path
        d="M 25 172 L 25 52 M 25 172 L 40 172 M 25 142 L 40 142 M 25 112 L 40 112 M 25 82 L 40 82 M 25 52 L 40 52"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="3,2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 3.8 }}
      />

      {/* Crane cable at top */}
      <motion.path
        d="M 100 5 L 100 15 M 97 15 L 103 15 L 103 20 Q 100 24, 97 20 L 97 15"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 4 }}
      />

      {/* Beam being lifted */}
      <motion.g
        initial={{ opacity: 0, y: -25, rotate: 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 4.2, ease: "easeOut" }}
      >
        <rect x="85" y="28" width="30" height="5" fill="rgba(255,255,255,0.15)" />
        <line x1="85" y1="28" x2="85" y2="33" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="115" y1="28" x2="115" y2="33" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="93" y1="25" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="107" y1="25" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.g>

      {/* Welding sparks effect */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 4.5, repeat: 3, repeatDelay: 0.4 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={`spark-${i}`}
            cx={82 + Math.random() * 6}
            cy={50 + Math.random() * 6}
            r="0.8"
            fill="rgba(255,255,255,0.6)"
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

// City skyline with refined architecture
function SkylineGraphic() {
  return (
    <motion.svg viewBox="0 0 320 200" className="w-full h-full">
      {/* Ground line */}
      <motion.line
        x1="5" y1="180" x2="315" y2="180"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* Building 1 - Art Deco tower */}
      <motion.path
        d="M 12 180 L 12 70 L 17 65 L 22 60 L 27 55 L 32 60 L 37 65 L 42 70 L 42 180"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay: 0.1, ease: "easeOut" }}
      />
      <motion.line x1="27" y1="55" x2="27" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2 }}
      />
      {[85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b1-w-${i}`}>
          <rect x="17" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)"
            style={{ opacity: 0 }} />
          <rect x="34" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)"
            style={{ opacity: 0 }} />
          <motion.rect x="17" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.4 + i * 0.04 }} />
          <motion.rect x="34" y={y} width="3" height="5" fill="rgba(255,255,255,0.08)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.45 + i * 0.04 }} />
        </motion.g>
      ))}

      {/* Building 2 - Modern glass tower */}
      <motion.path
        d="M 50 180 L 50 85 L 55 80 L 80 80 L 85 85 L 85 180"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
      />
      {/* Curtain wall grid */}
      {[95, 110, 125, 140, 155, 170].map((y, i) => (
        <motion.line key={`b2-h-${i}`} x1="52" y1={y} x2="83" y2={y}
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.2 + i * 0.05 }} />
      ))}
      {[58, 67, 76].map((x, i) => (
        <motion.line key={`b2-v-${i}`} x1={x} y1="85" x2={x} y2="180"
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.3 + i * 0.1 }} />
      ))}

      {/* Building 3 - Landmark skyscraper (tallest) */}
      <motion.path
        d="M 95 180 L 95 30 L 102 30 L 102 22 L 112 12 L 122 22 L 122 30 L 129 30 L 129 180"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay: 0.35, ease: "easeOut" }}
      />
      <motion.line x1="112" y1="30" x2="112" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.5 }}
      />
      {/* Setbacks */}
      <motion.path d="M 98 60 L 98 30 M 126 60 L 126 30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.7 }}
      />
      {[40, 55, 70, 85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b3-w-${i}`}>
          <motion.rect x="100" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.15, delay: 1.8 + i * 0.03 }} />
          <motion.rect x="108" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.15, delay: 1.85 + i * 0.03 }} />
          <motion.rect x="120" y={y} width="4" height="5" fill="rgba(255,255,255,0.1)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.15, delay: 1.9 + i * 0.03 }} />
        </motion.g>
      ))}

      {/* Building 4 - Wide commercial */}
      <motion.path
        d="M 138 180 L 138 95 L 143 88 L 177 88 L 182 95 L 182 180"
        fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />
      {/* Rooftop equipment */}
      <motion.path d="M 150 88 L 150 82 L 158 82 L 158 88 M 165 88 L 165 85 L 170 85 L 170 88"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.4 }}
      />
      {[105, 120, 135, 150, 165].map((y, i) => (
        <motion.g key={`b4-w-${i}`}>
          {[143, 152, 161, 170].map((x, j) => (
            <motion.rect key={`b4-w-${i}-${j}`} x={x} y={y} width="5" height="6" fill="rgba(255,255,255,0.06)"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 1.5 + i * 0.06 + j * 0.02 }} />
          ))}
        </motion.g>
      ))}

      {/* Building 5 - Tower with antenna */}
      <motion.path
        d="M 192 180 L 192 55 L 200 55 L 200 48 L 205 48 L 205 18 L 207 18 L 207 48 L 212 48 L 212 55 L 220 55 L 220 180"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.65, ease: "easeOut" }}
      />
      {[70, 88, 106, 124, 142, 160].map((y, i) => (
        <motion.g key={`b5-w-${i}`}>
          <motion.rect x="197" y={y} width="4" height="6" fill="rgba(255,255,255,0.07)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.9 + i * 0.04 }} />
          <motion.rect x="211" y={y} width="4" height="6" fill="rgba(255,255,255,0.07)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.95 + i * 0.04 }} />
        </motion.g>
      ))}

      {/* Building 6 - Modern with cantilever */}
      <motion.path
        d="M 230 180 L 230 75 L 235 75 L 235 70 L 260 70 L 265 75 L 268 75 L 268 105 L 265 105 L 265 180"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.8, ease: "easeOut" }}
      />
      {[85, 100, 115, 130, 145, 160].map((y, i) => (
        <motion.g key={`b6-w-${i}`}>
          {[235, 245, 255].map((x, j) => (
            <motion.rect key={`b6-w-${i}-${j}`} x={x} y={y} width="4" height="5" fill="rgba(255,255,255,0.05)"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 1.8 + i * 0.05 + j * 0.02 }} />
          ))}
        </motion.g>
      ))}

      {/* Building 7 - Narrow tower */}
      <motion.path
        d="M 278 180 L 278 65 L 283 60 L 288 65 L 288 180"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.95, ease: "easeOut" }}
      />
      {[80, 100, 120, 140, 160].map((y, i) => (
        <motion.rect key={`b7-w-${i}`} x="281" y={y} width="4" height="6" fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 1.7 + i * 0.05 }} />
      ))}

      {/* Building 8 - Low rise */}
      <motion.path
        d="M 295 180 L 295 120 L 312 120 L 312 180"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 1.05, ease: "easeOut" }}
      />
      {[130, 145, 160].map((y, i) => (
        <motion.g key={`b8-w-${i}`}>
          <motion.rect x="298" y={y} width="4" height="5" fill="rgba(255,255,255,0.04)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.6 + i * 0.05 }} />
          <motion.rect x="305" y={y} width="4" height="5" fill="rgba(255,255,255,0.04)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 1.65 + i * 0.05 }} />
        </motion.g>
      ))}

      {/* Beacon lights */}
      <motion.circle cx="27" cy="55" r="1.5" fill="rgba(255,255,255,0.35)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.circle cx="112" cy="12" r="2" fill="rgba(255,255,255,0.5)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
      />
      <motion.circle cx="206" cy="18" r="1.5" fill="rgba(255,255,255,0.35)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 3.1, repeat: Infinity, repeatDelay: 2 }}
      />
      <motion.circle cx="283" cy="60" r="1" fill="rgba(255,255,255,0.25)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 3.3, repeat: Infinity, repeatDelay: 1.8 }}
      />
    </motion.svg>
  );
}
