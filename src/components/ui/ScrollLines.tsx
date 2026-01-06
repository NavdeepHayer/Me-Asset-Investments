import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollLines() {
  const { scrollYProgress } = useScroll();

  // Less lag - higher stiffness for tighter scroll following
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Main line - draws through the entire page
  const mainLineProgress = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Secondary line - very slightly delayed
  const secondaryLineProgress = useTransform(smoothProgress, [0.01, 1], [0, 1]);

  return (
    <>
      {/* Desktop version - lines flow through graphics */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Main flowing line - matches graphic stroke style */}
          <motion.path
            d={`
              M 50 0
              L 50 8
              L 52 9
              L 68 12
              L 72 13
              L 72 17
              L 68 18
              L 52 21
              L 50 22
              L 50 26
              L 48 27
              L 32 30
              L 28 31
              L 28 35
              L 32 36
              L 48 39
              L 50 40
              L 50 44
              L 52 45
              L 68 48
              L 72 49
              L 72 53
              L 68 54
              L 52 57
              L 50 58
              L 50 65
              L 50 75
              L 50 85
              L 50 100
            `}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Secondary parallel line - offset, matching graphic secondary style */}
          <motion.path
            d={`
              M 49 0
              L 49 8
              L 51 9
              L 66 12
              L 70 13
              L 70 17
              L 66 18
              L 51 21
              L 49 22
              L 49 26
              L 47 27
              L 34 30
              L 30 31
              L 30 35
              L 34 36
              L 47 39
              L 49 40
              L 49 44
              L 51 45
              L 66 48
              L 70 49
              L 70 53
              L 66 54
              L 51 57
              L 49 58
              L 49 65
              L 49 75
              L 49 85
            `}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.08"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: secondaryLineProgress }}
          />

          {/* Third line - matches graphic detail lines */}
          <motion.path
            d={`
              M 51 0
              L 51 8
              L 53 9
              L 70 12
              L 74 13
              L 74 17
              L 70 18
              L 53 21
              L 51 22
              L 51 26
              L 49 27
              L 30 30
              L 26 31
              L 26 35
              L 30 36
              L 49 39
              L 51 40
              L 51 44
              L 53 45
              L 70 48
              L 74 49
              L 74 53
              L 70 54
              L 53 57
              L 51 58
              L 51 65
            `}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.06"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />
        </svg>
      </div>

      {/* Mobile version */}
      <div className="lg:hidden fixed inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Mobile main line - matching graphic stroke */}
          <motion.path
            d={`
              M 50 0
              L 50 7
              L 54 9
              L 54 12
              L 50 14
              L 50 20
              L 46 22
              L 46 25
              L 50 27
              L 50 33
              L 54 35
              L 54 38
              L 50 40
              L 50 50
              L 50 60
              L 50 70
              L 50 80
              L 50 90
              L 50 100
            `}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.15"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Mobile secondary line */}
          <motion.path
            d={`
              M 49 0
              L 49 7
              L 53 9
              L 53 12
              L 49 14
              L 49 20
              L 45 22
              L 45 25
              L 49 27
              L 49 33
              L 53 35
              L 53 38
              L 49 40
              L 49 50
              L 49 60
              L 49 70
            `}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: secondaryLineProgress }}
          />
        </svg>
      </div>
    </>
  );
}
