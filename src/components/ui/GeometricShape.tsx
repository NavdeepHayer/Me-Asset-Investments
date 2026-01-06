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
    <section className={`py-20 md:py-28 ${className}`}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`w-[200px] h-[200px] md:w-[280px] md:h-[280px] ${alignClasses[align]}`}
        >
          {variant === "circles" && (
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.05)" />
            </svg>
          )}
          {variant === "arcs" && (
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M 100 40 A 60 60 0 0 1 160 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <path d="M 100 60 A 40 40 0 0 1 140 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 20 100 A 80 80 0 0 1 100 180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M 40 100 A 60 60 0 0 1 100 160" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>
          )}
          {variant === "grid" && (
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {[...Array(5)].map((_, i) => (
                <line key={`h${i}`} x1="20" y1={40 + i * 30} x2="180" y2={40 + i * 30} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              ))}
              {[...Array(5)].map((_, i) => (
                <line key={`v${i}`} x1={40 + i * 30} y1="20" x2={40 + i * 30} y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              ))}
              <circle cx="100" cy="100" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="70" cy="70" r="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="130" cy="130" r="2" fill="rgba(255,255,255,0.2)" />
            </svg>
          )}
          {variant === "rings" && (
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" transform="rotate(-30 100 100)" />
              <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" transform="rotate(30 100 100)" />
              <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" transform="rotate(90 100 100)" />
              <circle cx="100" cy="100" r="8" fill="rgba(255,255,255,0.1)" />
            </svg>
          )}
        </motion.div>
      </div>
    </section>
  );
}
