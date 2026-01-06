import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function ScrollLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Track scroll progress
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to path length (0 to 1)
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const updateDimensions = () => {
      setPageHeight(document.documentElement.scrollHeight);
      setIsMobile(window.innerWidth < 1024);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (pageHeight === 0) return null;

  // Calculate viewBox based on page height
  const viewBoxWidth = 100;
  const aspectRatio = pageHeight / window.innerWidth;
  const viewBoxHeight = viewBoxWidth * aspectRatio;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ height: pageHeight }}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {isMobile ? (
          // Mobile: Simple vertical flow down the center
          <>
            <motion.path
              d={`M 50 8
                  C 50 15, 55 18, 55 22
                  C 55 28, 45 32, 45 38
                  C 45 44, 55 48, 55 54
                  C 55 60, 45 64, 45 70
                  C 45 76, 50 80, 50 ${viewBoxHeight * 0.95}`}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.15"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <motion.path
              d={`M 48 8
                  C 48 15, 53 18, 53 22
                  C 53 28, 43 32, 43 38
                  C 43 44, 53 48, 53 54
                  C 53 60, 43 64, 43 70
                  C 43 76, 48 80, 48 ${viewBoxHeight * 0.95}`}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.1"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </>
        ) : (
          // Desktop: Flowing paths that weave between left and right content
          <>
            {/* Main flowing line */}
            <motion.path
              d={`M 50 5
                  C 50 8, 70 10, 75 14
                  C 80 18, 75 22, 70 26
                  C 60 32, 30 36, 25 42
                  C 20 48, 25 52, 35 56
                  C 50 62, 75 66, 80 72
                  C 85 78, 70 82, 55 86
                  C 40 90, 50 94, 50 ${viewBoxHeight * 0.96}`}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.12"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {/* Secondary line - slightly offset */}
            <motion.path
              d={`M 52 5
                  C 52 8, 72 10, 77 14
                  C 82 18, 77 22, 72 26
                  C 62 32, 32 36, 27 42
                  C 22 48, 27 52, 37 56
                  C 52 62, 77 66, 82 72
                  C 87 78, 72 82, 57 86
                  C 42 90, 52 94, 52 ${viewBoxHeight * 0.96}`}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.08"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {/* Third subtle line */}
            <motion.path
              d={`M 48 5
                  C 48 8, 68 10, 73 14
                  C 78 18, 73 22, 68 26
                  C 58 32, 28 36, 23 42
                  C 18 48, 23 52, 33 56
                  C 48 62, 73 66, 78 72
                  C 83 78, 68 82, 53 86
                  C 38 90, 48 94, 48 ${viewBoxHeight * 0.96}`}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.06"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
