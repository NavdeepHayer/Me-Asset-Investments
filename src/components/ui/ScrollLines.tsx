import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollLines() {
  const { scrollYProgress } = useScroll();

  // Smooth the scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 30,
    restDelta: 0.001
  });

  // Main line - draws through the entire page
  const mainLineProgress = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Secondary line - slightly delayed
  const secondaryLineProgress = useTransform(smoothProgress, [0.03, 1], [0, 1]);

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
          {/*
            Path flows: center -> right (crane) -> center -> left (blueprint)
            -> center -> right (framework) -> center (skyline) -> center (team)
            Using percentage-based coordinates for responsive positioning
          */}

          {/* Main flowing line */}
          <motion.path
            d={`
              M 50 0
              L 50 8
              C 50 10, 55 11, 65 12
              L 72 13
              L 72 16
              C 72 18, 65 19, 50 20
              L 50 24
              C 50 26, 45 27, 32 28
              L 28 29
              L 28 33
              C 28 35, 40 36, 50 37
              L 50 42
              C 50 44, 60 45, 70 46
              L 73 47
              L 73 51
              C 73 53, 60 54, 50 55
              L 50 60
              L 50 65
              L 50 70
              L 50 80
              L 50 90
              L 50 100
            `}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.15"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Secondary parallel line - offset slightly */}
          <motion.path
            d={`
              M 48 0
              L 48 8
              C 48 10, 53 11, 63 12
              L 70 13
              L 70 16
              C 70 18, 63 19, 48 20
              L 48 24
              C 48 26, 43 27, 30 28
              L 26 29
              L 26 33
              C 26 35, 38 36, 48 37
              L 48 42
              C 48 44, 58 45, 68 46
              L 71 47
              L 71 51
              C 71 53, 58 54, 48 55
              L 48 60
              L 48 65
              L 48 70
              L 48 80
              L 48 90
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: secondaryLineProgress }}
          />

          {/* Third line - opposite offset */}
          <motion.path
            d={`
              M 52 0
              L 52 8
              C 52 10, 57 11, 67 12
              L 74 13
              L 74 16
              C 74 18, 67 19, 52 20
              L 52 24
              C 52 26, 47 27, 34 28
              L 30 29
              L 30 33
              C 30 35, 42 36, 52 37
              L 52 42
              C 52 44, 62 45, 72 46
              L 75 47
              L 75 51
              C 75 53, 62 54, 52 55
              L 52 60
              L 52 65
            `}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.08"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />
        </svg>
      </div>

      {/* Mobile version - simpler vertical flow */}
      <div className="lg:hidden fixed inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Mobile: graphics are stacked, so line flows center with subtle shifts */}
          <motion.path
            d={`
              M 50 0
              L 50 6
              C 50 7, 55 8, 58 9
              L 58 11
              C 58 12, 52 13, 50 14
              L 50 18
              C 50 19, 45 20, 42 21
              L 42 23
              C 42 24, 48 25, 50 26
              L 50 30
              C 50 31, 55 32, 58 33
              L 58 35
              C 58 36, 52 37, 50 38
              L 50 45
              L 50 55
              L 50 65
              L 50 75
              L 50 85
              L 50 100
            `}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Secondary mobile line */}
          <motion.path
            d={`
              M 48 0
              L 48 6
              C 48 7, 53 8, 56 9
              L 56 11
              C 56 12, 50 13, 48 14
              L 48 18
              C 48 19, 43 20, 40 21
              L 40 23
              C 40 24, 46 25, 48 26
              L 48 30
              C 48 31, 53 32, 56 33
              L 56 35
              C 56 36, 50 37, 48 38
              L 48 45
              L 48 55
              L 48 65
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.15"
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
