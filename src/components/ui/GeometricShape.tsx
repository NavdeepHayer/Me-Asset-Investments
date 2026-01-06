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
    <section className={`py-24 md:py-32 ${className}`}>
      <div className={`container-editorial flex ${alignClasses[align]}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-[220px] h-[220px] md:w-[320px] md:h-[320px]"
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

              {/* Tower 1 - tallest */}
              <motion.rect
                x="35" y="40" width="20" height="140"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "35px 180px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.line
                x1="45" y1="40" x2="45" y2="180"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />

              {/* Tower 2 - medium */}
              <motion.rect
                x="65" y="70" width="25" height="110"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "65px 180px" }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Tower 3 - tallest center */}
              <motion.rect
                x="100" y="25" width="22" height="155"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "100px 180px" }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.line
                x1="111" y1="25" x2="111" y2="180"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />

              {/* Tower 4 - short */}
              <motion.rect
                x="132" y="100" width="18" height="80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "132px 180px" }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Tower 5 - medium tall */}
              <motion.rect
                x="158" y="55" width="20" height="125"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "158px 180px" }}
                transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Connecting horizontal lines - scaffolding effect */}
              <motion.line
                x1="35" y1="90" x2="178" y2="90"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.4 }}
              />
              <motion.line
                x1="35" y1="130" x2="178" y2="130"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.6 }}
              />

              {/* Accent dots on tower tops */}
              <motion.circle
                cx="45" cy="40" r="2"
                fill="rgba(255,255,255,0.25)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.8 }}
              />
              <motion.circle
                cx="111" cy="25" r="2"
                fill="rgba(255,255,255,0.25)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 2 }}
              />
              <motion.circle
                cx="168" cy="55" r="2"
                fill="rgba(255,255,255,0.25)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 2.2 }}
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
    </section>
  );
}
