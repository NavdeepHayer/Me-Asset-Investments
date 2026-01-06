import { motion } from "framer-motion";

interface GeometricShapeProps {
  variant?: "circles" | "arcs" | "grid" | "rings";
  align?: "left" | "center" | "right";
  className?: string;
}

export function GeometricShape({
  variant = "circles",
  align = "center",
  className = ""
}: GeometricShapeProps) {
  const alignClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <section className={`py-24 md:py-32 ${className}`}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`w-[220px] h-[220px] md:w-[320px] md:h-[320px] ${alignClasses[align]}`}
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

          {variant === "grid" && (
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Horizontal lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.line
                  key={`h${i}`}
                  x1="10"
                  y1={25 + i * 25}
                  x2="190"
                  y2={25 + i * 25}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              ))}
              {/* Vertical lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.line
                  key={`v${i}`}
                  x1={25 + i * 25}
                  y1="10"
                  x2={25 + i * 25}
                  y2="190"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                />
              ))}
              {/* Accent dots at intersections */}
              <motion.circle
                cx="100" cy="100" r="5"
                fill="rgba(255,255,255,0.2)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.5 }}
              />
              <circle cx="75" cy="75" r="2" fill="rgba(255,255,255,0.15)" />
              <circle cx="125" cy="75" r="2" fill="rgba(255,255,255,0.15)" />
              <circle cx="75" cy="125" r="2" fill="rgba(255,255,255,0.15)" />
              <circle cx="125" cy="125" r="2" fill="rgba(255,255,255,0.15)" />
            </motion.svg>
          )}

          {variant === "rings" && (
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: -30, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.ellipse
                cx="100" cy="100" rx="85" ry="35"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                transform="rotate(-60 100 100)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.ellipse
                cx="100" cy="100" rx="85" ry="35"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                transform="rotate(0 100 100)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              />
              <motion.ellipse
                cx="100" cy="100" rx="85" ry="35"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                transform="rotate(60 100 100)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              />
              {/* Inner glow */}
              <motion.circle
                cx="100" cy="100" r="12"
                fill="rgba(255,255,255,0.08)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
              <motion.circle
                cx="100" cy="100" r="5"
                fill="rgba(255,255,255,0.15)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.8 }}
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
    </section>
  );
}
