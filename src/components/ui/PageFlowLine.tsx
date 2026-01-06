import { motion, useScroll, useTransform } from "framer-motion";

export function PageFlowLine() {
  const { scrollYProgress } = useScroll();

  // The line draws as you scroll down the page
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 lg:hidden">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {/* Single vertical line that flows through the center of the page */}
        <motion.line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
