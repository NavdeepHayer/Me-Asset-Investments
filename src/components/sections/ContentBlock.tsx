import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";

interface ContentBlockProps {
  text: string;
  graphic?: "grid" | "lines" | "dots" | "towers";
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
function GraphicElement({ variant }: { variant: "grid" | "lines" | "dots" | "towers" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={variant === "towers"
        ? "w-[280px] h-[200px] md:w-[400px] md:h-[280px] lg:w-[500px] lg:h-[350px]"
        : "w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px]"
      }
    >
      {variant === "grid" && <GridGraphic />}
      {variant === "lines" && <LinesGraphic />}
      {variant === "dots" && <DotsGraphic />}
      {variant === "towers" && <TowersGraphic />}
    </motion.div>
  );
}

// Abstract grid pattern
function GridGraphic() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
    >
      {/* Vertical lines */}
      {[40, 70, 100, 130, 160].map((x, i) => (
        <motion.line
          key={`v-${i}`}
          x1={x} y1="20" x2={x} y2="180"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}

      {/* Horizontal lines */}
      {[40, 70, 100, 130, 160].map((y, i) => (
        <motion.line
          key={`h-${i}`}
          x1="20" y1={y} x2="180" y2={y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
        />
      ))}

      {/* Accent squares at intersections */}
      {[
        [70, 70], [130, 70], [100, 100], [70, 130], [130, 130]
      ].map(([x, y], i) => (
        <motion.rect
          key={`sq-${i}`}
          x={x - 4} y={y - 4} width="8" height="8"
          fill="rgba(255,255,255,0.12)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
        />
      ))}

      {/* Diagonal accent line */}
      <motion.line
        x1="40" y1="160" x2="160" y2="40"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

// Flowing lines pattern
function LinesGraphic() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
    >
      {/* Flowing wave lines */}
      <motion.path
        d="M 10 100 Q 50 60, 100 100 T 190 100"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.path
        d="M 10 80 Q 50 40, 100 80 T 190 80"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.15, ease: "easeOut" }}
      />
      <motion.path
        d="M 10 120 Q 50 80, 100 120 T 190 120"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />
      <motion.path
        d="M 10 140 Q 50 100, 100 140 T 190 140"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.45, ease: "easeOut" }}
      />
      <motion.path
        d="M 10 60 Q 50 20, 100 60 T 190 60"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
      />

      {/* Vertical accent lines */}
      <motion.line
        x1="60" y1="30" x2="60" y2="170"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      />
      <motion.line
        x1="140" y1="30" x2="140" y2="170"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      />

      {/* Accent dots */}
      <motion.circle
        cx="60" cy="100" r="3"
        fill="rgba(255,255,255,0.2)"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.5 }}
      />
      <motion.circle
        cx="140" cy="100" r="3"
        fill="rgba(255,255,255,0.2)"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.7 }}
      />
    </motion.svg>
  );
}

// Dots pattern
function DotsGraphic() {
  const dots: [number, number, number][] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const x = 35 + col * 22;
      const y = 35 + row * 22;
      const delay = (row + col) * 0.05;
      dots.push([x, y, delay]);
    }
  }

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
    >
      {dots.map(([x, y, delay], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="2"
          fill="rgba(255,255,255,0.12)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay }}
        />
      ))}

      {/* Connecting lines for some dots */}
      <motion.path
        d="M 35 35 L 79 79 L 123 57 L 167 101"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1.5 }}
      />
      <motion.path
        d="M 57 123 L 101 145 L 145 123 L 167 167"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1.8 }}
      />

      {/* Larger accent dots */}
      {[[79, 79], [123, 101], [101, 145]].map(([x, y], i) => (
        <motion.circle
          key={`acc-${i}`}
          cx={x}
          cy={y}
          r="4"
          fill="rgba(255,255,255,0.2)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2 + i * 0.15 }}
        />
      ))}
    </motion.svg>
  );
}

// City skyline - wider for the building theme
function TowersGraphic() {
  return (
    <motion.svg
      viewBox="0 0 280 200"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Building 1 - Left tall tower with spire */}
      <motion.path
        d="M 20 180 L 20 55 L 27 55 L 27 45 L 30 45 L 30 35 L 33 18 L 36 35 L 36 45 L 39 45 L 39 55 L 46 55 L 46 180"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
      />
      {/* Windows - Building 1 */}
      {[70, 90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b1-w-${i}`}
          x="25" y={y} width="3" height="5"
          fill="rgba(255,255,255,0.08)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.4 + i * 0.06 }}
        />
      ))}
      {[70, 90, 110, 130, 150, 165].map((y, i) => (
        <motion.rect
          key={`b1-w2-${i}`}
          x="38" y={y} width="3" height="5"
          fill="rgba(255,255,255,0.08)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.5 + i * 0.06 }}
        />
      ))}

      {/* Building 2 - Modern stepped tower */}
      <motion.path
        d="M 55 180 L 55 95 L 62 95 L 62 75 L 82 75 L 82 95 L 89 95 L 89 180"
        fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
      />
      {[105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b2-w-${i}`}
          x="60" y={y} width="4" height="6"
          fill="rgba(255,255,255,0.06)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.3 + i * 0.08 }}
        />
      ))}
      {[105, 125, 145, 165].map((y, i) => (
        <motion.rect
          key={`b2-w2-${i}`}
          x="80" y={y} width="4" height="6"
          fill="rgba(255,255,255,0.06)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.4 + i * 0.08 }}
        />
      ))}

      {/* Building 3 - Central landmark tower (tallest) */}
      <motion.path
        d="M 100 180 L 100 38 L 106 38 L 106 28 L 112 12 L 118 28 L 118 38 L 124 38 L 124 180"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
      />
      <motion.line
        x1="112" y1="38" x2="112" y2="180"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.6 }}
      />
      {[50, 65, 80, 95, 110, 125, 140, 155, 170].map((y, i) => (
        <motion.rect
          key={`b3-w-${i}`}
          x="105" y={y} width="3" height="4"
          fill="rgba(255,255,255,0.1)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 1.8 + i * 0.05 }}
        />
      ))}
      {[50, 65, 80, 95, 110, 125, 140, 155, 170].map((y, i) => (
        <motion.rect
          key={`b3-w2-${i}`}
          x="116" y={y} width="3" height="4"
          fill="rgba(255,255,255,0.1)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 1.9 + i * 0.05 }}
        />
      ))}

      {/* Building 4 - Wide mid-rise */}
      <motion.path
        d="M 135 180 L 135 110 L 140 105 L 170 105 L 175 110 L 175 180"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
      />
      {[120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b4-w-${i}`}
          x="140" y={y} width="5" height="7"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
        />
      ))}
      {[120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b4-w2-${i}`}
          x="155" y={y} width="5" height="7"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.6 + i * 0.1 }}
        />
      ))}
      {[120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b4-w3-${i}`}
          x="166" y={y} width="5" height="7"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.7 + i * 0.1 }}
        />
      ))}

      {/* Building 5 - Right tower with antenna */}
      <motion.path
        d="M 185 180 L 185 60 L 196 60 L 196 55 L 198 55 L 198 22 L 200 22 L 200 55 L 202 55 L 202 60 L 213 60 L 213 180"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
      />
      {[75, 95, 115, 135, 155].map((y, i) => (
        <motion.rect
          key={`b5-w-${i}`}
          x="190" y={y} width="4" height="6"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2 + i * 0.06 }}
        />
      ))}
      {[75, 95, 115, 135, 155].map((y, i) => (
        <motion.rect
          key={`b5-w2-${i}`}
          x="204" y={y} width="4" height="6"
          fill="rgba(255,255,255,0.07)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 2.1 + i * 0.06 }}
        />
      ))}

      {/* Building 6 - Far right smaller */}
      <motion.path
        d="M 223 180 L 223 90 L 228 85 L 248 85 L 253 90 L 253 180"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
      />
      {[100, 120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b6-w-${i}`}
          x="228" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.8 + i * 0.08 }}
        />
      ))}
      {[100, 120, 140, 160].map((y, i) => (
        <motion.rect
          key={`b6-w2-${i}`}
          x="244" y={y} width="4" height="5"
          fill="rgba(255,255,255,0.05)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 1.9 + i * 0.08 }}
        />
      ))}

      {/* Ground line */}
      <motion.line
        x1="10" y1="180" x2="265" y2="180"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />

      {/* Antenna lights */}
      <motion.circle
        cx="33" cy="18" r="1.5"
        fill="rgba(255,255,255,0.3)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.5, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.circle
        cx="112" cy="12" r="1.5"
        fill="rgba(255,255,255,0.35)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.5, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
      />
      <motion.circle
        cx="199" cy="22" r="1.5"
        fill="rgba(255,255,255,0.3)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.5, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.svg>
  );
}
