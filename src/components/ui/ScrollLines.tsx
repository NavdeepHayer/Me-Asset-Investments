import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollLines() {
  const { scrollYProgress } = useScroll();

  // Main line progress - draws as you scroll through the page
  const mainLineProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // Branch lines - each starts drawing at different scroll points
  const branch1Progress = useTransform(scrollYProgress, [0.08, 0.18], [0, 1]);
  const branch2Progress = useTransform(scrollYProgress, [0.28, 0.38], [0, 1]);
  const branch3Progress = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const branch4Progress = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);

  // Secondary parallel line - slightly delayed
  const secondaryLineProgress = useTransform(scrollYProgress, [0.02, 0.87], [0, 1]);

  // Tertiary accent line
  const tertiaryLineProgress = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);

  return (
    <>
      {/* Desktop version */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 5000"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          {/* Main architectural line - jagged path down the page */}
          <motion.path
            d={`
              M 720 0
              L 720 180
              L 750 220
              L 750 380
              L 950 450
              L 950 520
              L 720 600
              L 720 750
              L 480 850
              L 480 950
              L 720 1050
              L 720 1200
              L 980 1350
              L 980 1450
              L 720 1550
              L 720 1750
              L 720 1900
              L 720 2100
              L 650 2200
              L 650 2400
              L 720 2500
              L 720 2800
              L 720 3200
              L 720 3600
              L 720 4000
              L 720 4500
            `}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Secondary line - offset parallel path */}
          <motion.path
            d={`
              M 700 50
              L 700 200
              L 730 240
              L 730 400
              L 920 470
              L 920 540
              L 700 620
              L 700 770
              L 500 870
              L 500 970
              L 700 1070
              L 700 1220
              L 960 1370
              L 960 1470
              L 700 1570
              L 700 1770
              L 700 1920
              L 700 2120
              L 630 2220
              L 630 2420
              L 700 2520
              L 700 2820
              L 700 3220
              L 700 3620
              L 700 4020
            `}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: secondaryLineProgress }}
          />

          {/* Tertiary accent line - more offset */}
          <motion.path
            d={`
              M 740 30
              L 740 160
              L 770 200
              L 770 360
              L 980 430
              L 980 500
              L 740 580
              L 740 730
              L 460 830
              L 460 930
              L 740 1030
              L 740 1180
              L 1000 1330
              L 1000 1430
              L 740 1530
              L 740 1730
              L 740 1880
              L 740 2080
              L 670 2180
              L 670 2380
              L 740 2480
            `}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: tertiaryLineProgress }}
          />

          {/* Branch 1 - reaches to crane (right side) */}
          <motion.path
            d={`
              M 950 450
              L 1020 450
              L 1050 480
              L 1100 480
              L 1100 520
              L 1050 520
              L 1050 560
            `}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch1Progress }}
          />

          {/* Branch 2 - reaches to blueprint (left side) */}
          <motion.path
            d={`
              M 480 850
              L 400 850
              L 370 880
              L 320 880
              L 320 920
              L 370 920
              L 370 960
            `}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch2Progress }}
          />

          {/* Branch 3 - reaches to framework (right side) */}
          <motion.path
            d={`
              M 980 1350
              L 1050 1350
              L 1080 1380
              L 1130 1380
              L 1130 1420
              L 1080 1420
              L 1080 1460
            `}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch3Progress }}
          />

          {/* Branch 4 - reaches to skyline (spreads wide) */}
          <motion.path
            d={`
              M 720 2100
              L 720 2150
              L 400 2200
              L 400 2250
              M 720 2150
              L 1040 2200
              L 1040 2250
            `}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch4Progress }}
          />

          {/* Extra architectural detail lines */}
          <motion.path
            d={`
              M 750 380 L 780 380
              M 750 400 L 770 400
              M 480 900 L 450 900
              M 480 920 L 460 920
              M 980 1400 L 1010 1400
              M 980 1420 L 1000 1420
            `}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
            strokeLinecap="round"
            style={{ pathLength: mainLineProgress }}
          />
        </svg>
      </div>

      {/* Mobile version - simpler, more vertical */}
      <div className="lg:hidden fixed inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 390 4000"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          {/* Main mobile line */}
          <motion.path
            d={`
              M 195 0
              L 195 150
              L 210 180
              L 210 350
              L 280 400
              L 280 480
              L 195 530
              L 195 700
              L 120 780
              L 120 860
              L 195 920
              L 195 1100
              L 270 1180
              L 270 1260
              L 195 1320
              L 195 1500
              L 195 1700
              L 195 1900
              L 180 1950
              L 180 2100
              L 195 2150
              L 195 2400
              L 195 2700
              L 195 3000
              L 195 3300
              L 195 3600
            `}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: mainLineProgress }}
          />

          {/* Secondary mobile line */}
          <motion.path
            d={`
              M 185 30
              L 185 170
              L 200 200
              L 200 370
              L 265 420
              L 265 500
              L 185 550
              L 185 720
              L 130 800
              L 130 880
              L 185 940
              L 185 1120
              L 255 1200
              L 255 1280
              L 185 1340
              L 185 1520
            `}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: secondaryLineProgress }}
          />

          {/* Mobile branch lines - shorter */}
          <motion.path
            d={`
              M 280 400 L 310 400 L 310 440
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch1Progress }}
          />

          <motion.path
            d={`
              M 120 780 L 90 780 L 90 820
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch2Progress }}
          />

          <motion.path
            d={`
              M 270 1180 L 300 1180 L 300 1220
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch3Progress }}
          />

          <motion.path
            d={`
              M 195 1900 L 100 1940 M 195 1900 L 290 1940
            `}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: branch4Progress }}
          />
        </svg>
      </div>
    </>
  );
}
