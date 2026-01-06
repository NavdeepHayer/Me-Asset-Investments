import { motion } from "framer-motion";

interface GeometricShapeProps {
  variant?: "circles" | "arcs" | "towers";
  align?: "left" | "center" | "right";
  className?: string;
}

export function GeometricShape({
  variant = "circles",
  align = "center",
  className = ""
}: GeometricShapeProps) {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <section className={`py-20 md:py-28 lg:py-36 ${className}`}>
      <div className={`container-wide flex ${alignClasses[align]}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] xl:w-[480px] xl:h-[480px]"
        >
          {variant === "circles" && (
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: -15 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.circle
                cx="100" cy="100" r="70"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              />
              <motion.circle
                cx="100" cy="100" r="50"
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              />
              <motion.circle
                cx="100" cy="100" r="30"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              />
              <motion.circle
                cx="100" cy="100" r="8"
                fill="rgba(255,255,255,0.1)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
              />
              {/* Accent dots */}
              <circle cx="100" cy="10" r="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="100" cy="190" r="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="10" cy="100" r="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="190" cy="100" r="2" fill="rgba(255,255,255,0.2)" />
            </motion.svg>
          )}

          {variant === "arcs" && (
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top right arcs */}
              <motion.path
                d="M 100 10 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.path
                d="M 100 30 A 70 70 0 0 1 170 100"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
              />
              <motion.path
                d="M 100 50 A 50 50 0 0 1 150 100"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
              {/* Bottom left arcs */}
              <motion.path
                d="M 10 100 A 90 90 0 0 1 100 190"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
              <motion.path
                d="M 30 100 A 70 70 0 0 1 100 170"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.65, ease: "easeOut" }}
              />
              <motion.path
                d="M 50 100 A 50 50 0 0 1 100 150"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              />
              {/* Center dot */}
              <motion.circle
                cx="100" cy="100" r="4"
                fill="rgba(255,255,255,0.15)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 }}
              />
            </motion.svg>
          )}

          {variant === "towers" && (
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Building 1 - Left tall tower with spire */}
              <motion.path
                d="M 25 180 L 25 55 L 32 55 L 32 45 L 35 45 L 35 35 L 38 20 L 41 35 L 41 45 L 44 45 L 44 55 L 51 55 L 51 180"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              />
              {/* Windows - Building 1 */}
              {[70, 90, 110, 130, 150, 165].map((y, i) => (
                <motion.rect
                  key={`b1-w-${i}`}
                  x="30" y={y} width="3" height="5"
                  fill="rgba(255,255,255,0.08)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.5 + i * 0.08 }}
                />
              ))}
              {[70, 90, 110, 130, 150, 165].map((y, i) => (
                <motion.rect
                  key={`b1-w2-${i}`}
                  x="43" y={y} width="3" height="5"
                  fill="rgba(255,255,255,0.08)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.6 + i * 0.08 }}
                />
              ))}

              {/* Building 2 - Modern stepped tower */}
              <motion.path
                d="M 58 180 L 58 90 L 65 90 L 65 70 L 80 70 L 80 90 L 87 90 L 87 180"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              />
              {/* Windows - Building 2 */}
              {[100, 120, 140, 160].map((y, i) => (
                <motion.rect
                  key={`b2-w-${i}`}
                  x="63" y={y} width="4" height="6"
                  fill="rgba(255,255,255,0.06)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
                />
              ))}
              {[100, 120, 140, 160].map((y, i) => (
                <motion.rect
                  key={`b2-w2-${i}`}
                  x="78" y={y} width="4" height="6"
                  fill="rgba(255,255,255,0.06)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
                />
              ))}

              {/* Building 3 - Central landmark tower (tallest) */}
              <motion.path
                d="M 95 180 L 95 40 L 100 40 L 100 30 L 105 15 L 110 30 L 110 40 L 115 40 L 115 180"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
              />
              {/* Vertical detail line */}
              <motion.line
                x1="105" y1="40" x2="105" y2="180"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.8 }}
              />
              {/* Windows - Building 3 */}
              {[50, 65, 80, 95, 110, 125, 140, 155, 170].map((y, i) => (
                <motion.rect
                  key={`b3-w-${i}`}
                  x="99" y={y} width="3" height="4"
                  fill="rgba(255,255,255,0.1)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 2 + i * 0.06 }}
                />
              ))}
              {[50, 65, 80, 95, 110, 125, 140, 155, 170].map((y, i) => (
                <motion.rect
                  key={`b3-w2-${i}`}
                  x="108" y={y} width="3" height="4"
                  fill="rgba(255,255,255,0.1)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 2.1 + i * 0.06 }}
                />
              ))}

              {/* Building 4 - Short wide building */}
              <motion.path
                d="M 122 180 L 122 120 L 127 115 L 145 115 L 150 120 L 150 180"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              />
              {/* Windows - Building 4 */}
              {[130, 145, 160].map((y, i) => (
                <motion.rect
                  key={`b4-w-${i}`}
                  x="127" y={y} width="6" height="7"
                  fill="rgba(255,255,255,0.05)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.6 + i * 0.1 }}
                />
              ))}
              {[130, 145, 160].map((y, i) => (
                <motion.rect
                  key={`b4-w2-${i}`}
                  x="139" y={y} width="6" height="7"
                  fill="rgba(255,255,255,0.05)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.7 + i * 0.1 }}
                />
              ))}

              {/* Building 5 - Right tower with antenna */}
              <motion.path
                d="M 157 180 L 157 60 L 168 60 L 168 55 L 170 55 L 170 25 L 172 25 L 172 55 L 174 55 L 174 60 L 185 60 L 185 180"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
              />
              {/* Windows - Building 5 */}
              {[75, 95, 115, 135, 155].map((y, i) => (
                <motion.rect
                  key={`b5-w-${i}`}
                  x="162" y={y} width="4" height="6"
                  fill="rgba(255,255,255,0.07)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 2.2 + i * 0.08 }}
                />
              ))}
              {[75, 95, 115, 135, 155].map((y, i) => (
                <motion.rect
                  key={`b5-w2-${i}`}
                  x="176" y={y} width="4" height="6"
                  fill="rgba(255,255,255,0.07)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 2.3 + i * 0.08 }}
                />
              ))}

              {/* Ground line */}
              <motion.line
                x1="15" y1="180" x2="195" y2="180"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              />

              {/* Antenna lights */}
              <motion.circle
                cx="38" cy="20" r="1.5"
                fill="rgba(255,255,255,0.3)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0.5, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.circle
                cx="105" cy="15" r="1.5"
                fill="rgba(255,255,255,0.35)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0.5, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
              />
              <motion.circle
                cx="171" cy="25" r="1.5"
                fill="rgba(255,255,255,0.3)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0.5, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
    </section>
  );
}
