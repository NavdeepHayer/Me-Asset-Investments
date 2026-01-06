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

  // Standalone graphic (no text) - full width centered
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
          // Desktop: side-by-side layout
          <div className={`flex flex-col ${graphicPosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-16 xl:gap-24 items-center`}>
            {/* Text content */}
            <div className="flex-1 lg:max-w-[55%]">
              <ScrollReveal duration={1} distance={50}>
                <p className="text-body-large">{text}</p>
              </ScrollReveal>
            </div>

            {/* Graphic */}
            <div className="flex-1 flex justify-center lg:justify-center">
              <GraphicElement variant={graphic} />
            </div>
          </div>
        ) : (
          // No graphic - centered text
          <div className="max-w-4xl mx-auto">
            <ScrollReveal duration={1} distance={50}>
              <p className="text-body-large">{text}</p>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}

// Inline graphic component
function GraphicElement({ variant }: { variant: "crane" | "blueprint" | "framework" | "skyline" }) {
  const isWide = variant === "skyline";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={isWide
        ? "w-[300px] h-[200px] md:w-[450px] md:h-[300px] lg:w-[550px] lg:h-[380px]"
        : "w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px]"
      }
    >
      {variant === "crane" && <CraneGraphic />}
      {variant === "blueprint" && <BlueprintGraphic />}
      {variant === "framework" && <FrameworkGraphic />}
      {variant === "skyline" && <SkylineGraphic />}
    </motion.div>
  );
}

// Construction crane with animated arm
function CraneGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Base/foundation */}
      <motion.rect
        x="85" y="175" width="30" height="10"
        fill="rgba(255,255,255,0.1)"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      />

      {/* Main tower/mast */}
      <motion.path
        d="M 95 175 L 95 45 M 105 175 L 105 45"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Tower cross bracing */}
      {[160, 130, 100, 70].map((y, i) => (
        <motion.path
          key={`brace-${i}`}
          d={`M 95 ${y} L 105 ${y - 25} M 105 ${y} L 95 ${y - 25}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
        />
      ))}

      {/* Operator cabin */}
      <motion.rect
        x="88" y="42" width="24" height="15"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.2 }}
      />

      {/* Jib (horizontal arm) - extends right */}
      <motion.path
        d="M 100 42 L 180 42"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
      />

      {/* Jib support cables */}
      <motion.path
        d="M 100 30 L 140 42 M 100 30 L 180 42"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.8 }}
      />

      {/* Counter-jib (extends left) */}
      <motion.path
        d="M 100 42 L 50 42"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.6 }}
      />

      {/* Counterweight */}
      <motion.rect
        x="45" y="42" width="15" height="12"
        fill="rgba(255,255,255,0.1)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 2 }}
      />

      {/* Trolley on jib */}
      <motion.rect
        x="145" y="38" width="10" height="8"
        fill="rgba(255,255,255,0.12)"
        initial={{ x: 110 }}
        whileInView={{ x: 145 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 2.2, ease: "easeInOut" }}
      />

      {/* Hook cable */}
      <motion.line
        x1="150" y1="46" x2="150" y2="120"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 2.5 }}
      />

      {/* Hook */}
      <motion.path
        d="M 147 120 L 150 125 L 153 120 M 150 125 L 150 130 Q 145 135, 150 140 Q 155 135, 150 130"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 3 }}
      />

      {/* Load being lifted */}
      <motion.rect
        x="140" y="145" width="20" height="15"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 3.2, ease: "easeOut" }}
      />

      {/* Ground line */}
      <motion.line
        x1="20" y1="185" x2="180" y2="185"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* Warning light on top */}
      <motion.circle
        cx="100" cy="30" r="2"
        fill="rgba(255,255,255,0.4)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 2, repeat: Infinity, repeatDelay: 0.5 }}
      />
    </motion.svg>
  );
}

// Architectural blueprint / floor plan
function BlueprintGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Outer building boundary */}
      <motion.rect
        x="25" y="25" width="150" height="150"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Internal walls - vertical */}
      <motion.line
        x1="85" y1="25" x2="85" y2="120"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      <motion.line
        x1="130" y1="80" x2="130" y2="175"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
      />

      {/* Internal walls - horizontal */}
      <motion.line
        x1="25" y1="80" x2="85" y2="80"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.2 }}
      />
      <motion.line
        x1="85" y1="120" x2="175" y2="120"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.4 }}
      />

      {/* Door openings (gaps in walls) represented by small arcs */}
      <motion.path
        d="M 50 80 A 8 8 0 0 1 50 64"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="2,2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.8 }}
      />
      <motion.path
        d="M 85 145 A 8 8 0 0 0 101 145"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="2,2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 2 }}
      />

      {/* Window symbols on exterior */}
      {[45, 65, 145, 165].map((x, i) => (
        <motion.line
          key={`win-top-${i}`}
          x1={x} y1="25" x2={x} y2="20"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.2 + i * 0.1 }}
        />
      ))}
      {[55, 95, 135].map((y, i) => (
        <motion.line
          key={`win-left-${i}`}
          x1="25" y1={y} x2="20" y2={y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.4 + i * 0.1 }}
        />
      ))}

      {/* Dimension lines */}
      <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.5 }}>
        <line x1="25" y1="190" x2="175" y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="25" y1="188" x2="25" y2="192" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="175" y1="188" x2="175" y2="192" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="10" y1="25" x2="10" y2="175" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="8" y1="25" x2="12" y2="25" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1="8" y1="175" x2="12" y2="175" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </motion.g>

      {/* Room labels - small squares */}
      {[[45, 52], [110, 52], [55, 145], [152, 147]].map(([x, y], i) => (
        <motion.rect
          key={`label-${i}`}
          x={x - 8} y={y - 5} width="16" height="10"
          fill="rgba(255,255,255,0.06)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.8 + i * 0.1 }}
        />
      ))}

      {/* Stairs symbol */}
      <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3 }}>
        {[0, 4, 8, 12, 16].map((offset, i) => (
          <line
            key={`stair-${i}`}
            x1={145 + offset} y1="135"
            x2={145 + offset} y2="155"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}
      </motion.g>

      {/* Compass rose */}
      <motion.g
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 3.2 }}
      >
        <circle cx="165" cy="45" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="165" y1="35" x2="165" y2="55" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="155" y1="45" x2="175" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <polygon points="165,33 162,38 168,38" fill="rgba(255,255,255,0.2)" />
      </motion.g>
    </motion.svg>
  );
}

// Steel building framework / skeleton structure
function FrameworkGraphic() {
  return (
    <motion.svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Ground line */}
      <motion.line
        x1="20" y1="180" x2="180" y2="180"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Foundation */}
      <motion.rect
        x="35" y="175" width="130" height="5"
        fill="rgba(255,255,255,0.08)"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Vertical columns */}
      {[45, 85, 125, 165].map((x, i) => (
        <motion.line
          key={`col-${i}`}
          x1={x} y1="175" x2={x} y2="25"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
        />
      ))}

      {/* Horizontal beams - floor levels */}
      {[145, 115, 85, 55, 25].map((y, i) => (
        <motion.line
          key={`beam-${i}`}
          x1="45" y1={y} x2="165" y2={y}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 + i * 0.2 }}
        />
      ))}

      {/* Cross bracing - X patterns between columns */}
      {/* Left bay */}
      <motion.path
        d="M 45 145 L 85 115 M 85 145 L 45 115"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 2.2 }}
      />
      <motion.path
        d="M 45 85 L 85 55 M 85 85 L 45 55"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 2.4 }}
      />

      {/* Right bay */}
      <motion.path
        d="M 125 145 L 165 115 M 165 145 L 125 115"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 2.6 }}
      />
      <motion.path
        d="M 125 85 L 165 55 M 165 85 L 125 55"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 2.8 }}
      />

      {/* Bolt/connection points at intersections */}
      {[
        [45, 145], [85, 145], [125, 145], [165, 145],
        [45, 115], [85, 115], [125, 115], [165, 115],
        [45, 85], [85, 85], [125, 85], [165, 85],
        [45, 55], [85, 55], [125, 55], [165, 55],
        [45, 25], [85, 25], [125, 25], [165, 25],
      ].map(([x, y], i) => (
        <motion.circle
          key={`bolt-${i}`}
          cx={x} cy={y} r="2"
          fill="rgba(255,255,255,0.15)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 3 + i * 0.03 }}
        />
      ))}

      {/* Temporary supports/scaffolding on one side */}
      <motion.path
        d="M 30 175 L 30 85 L 45 85 M 30 145 L 45 145 M 30 115 L 45 115"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="3,3"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 3.5 }}
      />

      {/* Crane hook at top (being built) */}
      <motion.path
        d="M 105 10 L 105 20 M 102 20 L 108 20 L 108 28 Q 105 32, 102 28 L 102 20"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 3.8 }}
      />

      {/* Beam being lifted into place */}
      <motion.rect
        x="90" y="32" width="30" height="4"
        fill="rgba(255,255,255,0.12)"
        initial={{ opacity: 0, y: -20, rotate: 5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 4, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

// City skyline - wider panoramic view
function SkylineGraphic() {
  return (
    <motion.svg
      viewBox="0 0 300 200"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Building 1 - Left tower with crown */}
      <motion.path
        d="M 15 180 L 15 65 L 20 60 L 25 65 L 25 55 L 30 50 L 35 55 L 35 65 L 40 60 L 45 65 L 45 180"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
      />
      {[80, 100, 120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b1-w-${i}`}
          x="20" y={y} width="3" height="6"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.4 + i * 0.05 }}
        />
      ))}
      {[80, 100, 120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b1-w2-${i}`}
          x="37" y={y} width="3" height="6"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.5 + i * 0.05 }}
        />
      ))}

      {/* Building 2 - Stepped modernist */}
      <motion.path
        d="M 52 180 L 52 100 L 60 100 L 60 80 L 75 80 L 75 100 L 83 100 L 83 180"
        fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
      />
      {[90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b2-w-${i}`}
          x="57" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.06)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.3 + i * 0.06 }}
        />
      ))}
      {[90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b2-w2-${i}`}
          x="74" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.06)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.4 + i * 0.06 }}
        />
      ))}

      {/* Building 3 - Main landmark tower (tallest) */}
      <motion.path
        d="M 95 180 L 95 35 L 102 35 L 102 25 L 110 10 L 118 25 L 118 35 L 125 35 L 125 180"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
      />
      <motion.line
        x1="110" y1="35" x2="110" y2="180"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.6 }}
      />
      {[45, 60, 75, 90, 105, 120, 135, 150, 165].map((y, i) => (
        <motion.rect
          key={`b3-w-${i}`}
          x="100" y={y} width="3" height="4"
          fill="rgba(255,255,255,0.1)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 1.8 + i * 0.04 }}
        />
      ))}
      {[45, 60, 75, 90, 105, 120, 135, 150, 165].map((y, i) => (
        <motion.rect
          key={`b3-w2-${i}`}
          x="117" y={y} width="3" height="4"
          fill="rgba(255,255,255,0.1)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 1.9 + i * 0.04 }}
        />
      ))}

      {/* Building 4 - Wide commercial */}
      <motion.path
        d="M 133 180 L 133 95 L 138 90 L 172 90 L 177 95 L 177 180"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
      />
      {[105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b4-w-${i}`}
          x="138" y={y} width="5" height="6"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.5 + i * 0.08 }}
        />
      ))}
      {[105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b4-w2-${i}`}
          x="152" y={y} width="5" height="6"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.6 + i * 0.08 }}
        />
      ))}
      {[105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b4-w3-${i}`}
          x="166" y={y} width="5" height="6"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.7 + i * 0.08 }}
        />
      ))}

      {/* Building 5 - Tower with antenna */}
      <motion.path
        d="M 185 180 L 185 55 L 196 55 L 196 50 L 199 50 L 199 20 L 201 20 L 201 50 L 204 50 L 204 55 L 215 55 L 215 180"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
      />
      {[70, 90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b5-w-${i}`}
          x="190" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2 + i * 0.05 }}
        />
      ))}
      {[70, 90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b5-w2-${i}`}
          x="206" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.1 + i * 0.05 }}
        />
      ))}

      {/* Building 6 - Smaller right side */}
      <motion.path
        d="M 223 180 L 223 85 L 230 80 L 255 80 L 262 85 L 262 180"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
      />
      {[95, 115, 135, 155].map((y, i) => (
        <motion.rect
          key={`b6-w-${i}`}
          x="228" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.8 + i * 0.06 }}
        />
      ))}
      {[95, 115, 135, 155].map((y, i) => (
        <motion.rect
          key={`b6-w2-${i}`}
          x="242" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.9 + i * 0.06 }}
        />
      ))}
      {[95, 115, 135, 155].map((y, i) => (
        <motion.rect
          key={`b6-w3-${i}`}
          x="254" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2 + i * 0.06 }}
        />
      ))}

      {/* Building 7 - Far right narrow */}
      <motion.path
        d="M 270 180 L 270 70 L 285 70 L 285 180"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      />
      {[85, 105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b7-w-${i}`}
          x="275" y={y} width="3" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.2 + i * 0.05 }}
        />
      ))}

      {/* Ground line */}
      <motion.line
        x1="5" y1="180" x2="295" y2="180"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />

      {/* Antenna/beacon lights */}
      <motion.circle
        cx="30" cy="50" r="1.5"
        fill="rgba(255,255,255,0.3)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.4, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.circle
        cx="110" cy="10" r="2"
        fill="rgba(255,255,255,0.4)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.4, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
      />
      <motion.circle
        cx="200" cy="20" r="1.5"
        fill="rgba(255,255,255,0.3)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.4, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.svg>
  );
}
