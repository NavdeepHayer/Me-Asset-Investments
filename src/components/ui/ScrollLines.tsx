import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollLines() {
  const { scrollYProgress } = useScroll();

  // Direct scroll mapping - no spring, instant response
  const mainProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const delayedProgress = useTransform(scrollYProgress, [0.005, 1], [0, 1]);

  return (
    <>
      {/* Desktop - clean architectural lines */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Primary line - flows through graphic positions */}
          <motion.path
            d={`
              M 50 0
              L 50 10
              L 75 14
              L 75 18
              L 50 22
              L 25 30
              L 25 34
              L 50 38
              L 75 46
              L 75 50
              L 50 54
              L 50 100
            `}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.08"
            strokeLinejoin="miter"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainProgress }}
          />

          {/* Secondary line - tight parallel */}
          <motion.path
            d={`
              M 50.5 0
              L 50.5 10
              L 75.5 14
              L 75.5 18
              L 50.5 22
              L 25.5 30
              L 25.5 34
              L 50.5 38
              L 75.5 46
              L 75.5 50
              L 50.5 54
              L 50.5 100
            `}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.05"
            strokeLinejoin="miter"
            fill="none"
            pathLength="1"
            style={{ pathLength: delayedProgress }}
          />
        </svg>
      </div>

      {/* Mobile - simpler vertical with slight offsets */}
      <div className="lg:hidden fixed inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d={`
              M 50 0
              L 50 9
              L 55 12
              L 55 15
              L 50 18
              L 45 24
              L 45 27
              L 50 30
              L 55 36
              L 55 39
              L 50 42
              L 50 100
            `}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.12"
            strokeLinejoin="miter"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainProgress }}
          />

          <motion.path
            d={`
              M 50.8 0
              L 50.8 9
              L 55.8 12
              L 55.8 15
              L 50.8 18
              L 45.8 24
              L 45.8 27
              L 50.8 30
              L 55.8 36
              L 55.8 39
              L 50.8 42
              L 50.8 100
            `}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.08"
            strokeLinejoin="miter"
            fill="none"
            pathLength="1"
            style={{ pathLength: delayedProgress }}
          />
        </svg>
      </div>
    </>
  );
}
