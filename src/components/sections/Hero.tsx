import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

interface HeroProps {
  hasNews?: boolean;
}

export function Hero({ hasNews = false }: HeroProps) {
  const { company } = siteContent;

  // Animation timing constants (in seconds)
  const LINE_DURATION = 3.5; // Total time for line to draw all buildings
  const DETAIL_FADE_DURATION = 0.4;

  // Building completion times (as percentage of LINE_DURATION)
  const bigBenComplete = 0.12;      // ~0.96s
  const georgianComplete = 0.24;    // ~1.92s
  const shardComplete = 0.38;       // ~3.04s
  const stPaulsComplete = 0.52;     // ~4.16s - logo starts here
  const gherkinComplete = 0.65;     // ~5.20s
  const modernComplete = 0.78;      // ~6.24s
  const artDecoComplete = 0.88;     // ~7.04s

  // Convert to actual delay times
  const bigBenDetailDelay = bigBenComplete * LINE_DURATION;
  const georgianDetailDelay = georgianComplete * LINE_DURATION;
  const shardDetailDelay = shardComplete * LINE_DURATION;
  const stPaulsDetailDelay = stPaulsComplete * LINE_DURATION;
  const gherkinDetailDelay = gherkinComplete * LINE_DURATION;
  const modernDetailDelay = modernComplete * LINE_DURATION;
  const artDecoDetailDelay = artDecoComplete * LINE_DURATION;

  // Logo appears when line reaches center (St Paul's area)
  const logoDelay = stPaulsComplete * LINE_DURATION;
  const taglineDelay = logoDelay + 0.5;

  // Single continuous path that draws all buildings left to right
  // goes down at the right, then returns to center and continues down
  const skylinePath = `
    M 0 195
    L 25 195 L 25 55 L 30 48 L 35 25 L 40 48 L 45 55 L 45 195
    L 55 195 L 55 85 L 63 72 L 71 85 L 71 90 L 79 77 L 87 90 L 87 88 L 95 75 L 103 88 L 103 195
    L 125 195 L 145 20 L 165 195
    L 180 195 L 180 110 L 184 102 L 184 90 Q 200 55, 216 90 L 216 102 L 220 110 L 220 195
    L 245 195 L 245 100 Q 245 50, 260 50 Q 275 50, 275 100 L 275 195
    L 295 195 L 295 75 L 305 65 L 315 65 L 325 75 L 325 195
    L 340 195 L 340 120 L 345 115 L 345 95 L 350 90 L 350 70 L 360 70 L 360 90 L 365 95 L 365 115 L 370 120 L 370 195
    L 400 195
    L 400 220
    L 200 220
    L 200 280
  `;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" data-hero>
      {/* Marker for where hero line ends - PageFlowLine connects from here */}
      <div
        data-hero-line-end
        className="absolute left-1/2 -translate-x-1/2 bottom-[15vh] sm:bottom-[12vh] md:bottom-[10vh] w-1 h-1"
      />

      {/* UK City Skyline background - desktop: pushed down, mobile: closer to content */}
      <div className="absolute inset-0 flex items-end justify-center pb-[8vh] sm:pb-[6vh] md:pb-[2vh] z-[5]">
        <motion.svg
          viewBox="0 0 400 280"
          className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[58vw] lg:max-w-[52vw] xl:max-w-[48vw] 2xl:max-w-[44vw] h-auto gpu-accelerated"
          initial={{ opacity: 1 }}
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Glow filter for the drawing line */}
          <defs>
            <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Main drawing line - single continuous path */}
          <motion.path
            d={skylinePath}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-line)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: LINE_DURATION, ease: "easeInOut" }}
          />

          {/* Static building outlines (appear as line passes through) */}

          {/* Big Ben outline */}
          <motion.path
            d="M 25 195 L 25 55 L 30 48 L 35 25 L 40 48 L 45 55 L 45 195"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bigBenDetailDelay, duration: 0.3 }}
          />

          {/* Big Ben details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bigBenDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {/* Spire */}
            <line x1="35" y1="25" x2="35" y2="12" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {/* Clock face */}
            <circle cx="35" cy="68" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="35" y1="62" x2="35" y2="68" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
            <line x1="35" y1="68" x2="39" y2="71" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
            {/* Tower bands */}
            <line x1="25" y1="90" x2="45" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <line x1="25" y1="120" x2="45" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <line x1="25" y1="150" x2="45" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            {/* Windows */}
            {[100, 130, 160, 180].map((y, i) => (
              <rect key={`bb-w-${i}`} x="30" y={y} width="10" height="8" fill="rgba(255,255,255,0.05)" />
            ))}
          </motion.g>

          {/* Georgian Townhouses outline */}
          <motion.path
            d="M 55 195 L 55 85 L 63 72 L 71 85 L 71 195 M 71 195 L 71 90 L 79 77 L 87 90 L 87 195 M 87 195 L 87 88 L 95 75 L 103 88 L 103 195"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: georgianDetailDelay, duration: 0.3 }}
          />

          {/* Georgian details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: georgianDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {/* Chimneys */}
            <rect x="58" y="68" width="4" height="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <rect x="74" y="73" width="4" height="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <rect x="90" y="71" width="4" height="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            {/* Windows */}
            {[100, 125, 150].map((y, i) => (
              <g key={`th-row-${i}`}>
                <rect x="58" y={y} width="6" height="8" fill="rgba(255,255,255,0.04)" />
                <rect x="74" y={y + 5} width="6" height="8" fill="rgba(255,255,255,0.04)" />
                <rect x="90" y={y + 3} width="6" height="8" fill="rgba(255,255,255,0.04)" />
              </g>
            ))}
            {/* Doors */}
            <rect x="60" y="178" width="6" height="17" fill="rgba(255,255,255,0.06)" />
            <rect x="76" y="178" width="6" height="17" fill="rgba(255,255,255,0.06)" />
            <rect x="92" y="178" width="6" height="17" fill="rgba(255,255,255,0.06)" />
          </motion.g>

          {/* Small building filler */}
          <motion.rect
            x="110" y="150" width="12" height="45"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: georgianDetailDelay + 0.2, duration: DETAIL_FADE_DURATION }}
          />

          {/* The Shard outline */}
          <motion.path
            d="M 145 20 L 125 195 M 145 20 L 165 195 M 145 20 L 145 195"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shardDetailDelay, duration: 0.3 }}
          />

          {/* Shard details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shardDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {[50, 75, 100, 125, 150, 175].map((y, i) => {
              const width = (195 - y) * 0.12;
              return (
                <line key={`sh-${i}`} x1={145 - width} y1={y} x2={145 + width} y2={y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              );
            })}
          </motion.g>

          {/* St Paul's Dome outline */}
          <motion.path
            d="M 180 195 L 180 110 L 184 102 L 184 90 M 220 195 L 220 110 L 216 102 L 216 90 M 184 90 Q 200 55, 216 90"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: stPaulsDetailDelay, duration: 0.3 }}
          />

          {/* St Paul's details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: stPaulsDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {/* Lantern/cross */}
            <line x1="200" y1="55" x2="200" y2="42" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="195" y1="48" x2="205" y2="48" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
            {/* Columns */}
            <line x1="184" y1="110" x2="184" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="193" y1="110" x2="193" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="207" y1="110" x2="207" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="216" y1="110" x2="216" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="180" y1="140" x2="220" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="180" y1="170" x2="220" y2="170" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </motion.g>

          {/* Small building filler */}
          <motion.rect
            x="230" y="160" width="10" height="35"
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: stPaulsDetailDelay + 0.2, duration: DETAIL_FADE_DURATION }}
          />

          {/* Gherkin outline */}
          <motion.path
            d="M 245 195 L 245 100 Q 245 50, 260 50 Q 275 50, 275 100 L 275 195"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: gherkinDetailDelay, duration: 0.3 }}
          />

          {/* Gherkin details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: gherkinDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {[70, 95, 120, 145, 170].map((y, i) => {
              const squeeze = Math.min(1, (y - 50) / 50);
              const halfWidth = 15 * squeeze;
              return (
                <g key={`gh-${i}`}>
                  <line x1={260 - halfWidth} y1={y} x2={260 + halfWidth} y2={y}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1={260 - halfWidth * 0.7} y1={y - 12} x2={260 + halfWidth * 0.7} y2={y + 12}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                  <line x1={260 + halfWidth * 0.7} y1={y - 12} x2={260 - halfWidth * 0.7} y2={y + 12}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                </g>
              );
            })}
          </motion.g>

          {/* Modern Office Tower outline */}
          <motion.path
            d="M 295 195 L 295 75 L 305 65 L 315 65 L 325 75 L 325 195"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: modernDetailDelay, duration: 0.3 }}
          />

          {/* Modern tower details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: modernDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {[85, 105, 125, 145, 165].map((y, i) => (
              <g key={`mt-${i}`}>
                <rect x="298" y={y} width="8" height="10" fill="rgba(255,255,255,0.05)" />
                <rect x="310" y={y} width="8" height="10" fill="rgba(255,255,255,0.05)" />
              </g>
            ))}
          </motion.g>

          {/* Art Deco Building outline */}
          <motion.path
            d="M 340 195 L 340 120 L 345 115 L 345 95 L 350 90 L 350 70 L 360 70 L 360 90 L 365 95 L 365 115 L 370 120 L 370 195"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: artDecoDetailDelay, duration: 0.3 }}
          />

          {/* Art Deco details */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: artDecoDetailDelay, duration: DETAIL_FADE_DURATION }}
          >
            {[130, 150, 170].map((y, i) => (
              <g key={`ad-${i}`}>
                <rect x="343" y={y} width="5" height="8" fill="rgba(255,255,255,0.04)" />
                <rect x="352" y={y} width="5" height="8" fill="rgba(255,255,255,0.04)" />
                <rect x="362" y={y} width="5" height="8" fill="rgba(255,255,255,0.04)" />
              </g>
            ))}
            <rect x="352" y="100" width="5" height="6" fill="rgba(255,255,255,0.04)" />
            <rect x="352" y="78" width="5" height="6" fill="rgba(255,255,255,0.04)" />
          </motion.g>

          {/* Small building filler right */}
          <motion.rect
            x="380" y="140" width="15" height="55"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: artDecoDetailDelay + 0.2, duration: DETAIL_FADE_DURATION }}
          />

          {/* Ground line (static, subtle) */}
          <line x1="0" y1="195" x2="400" y2="195" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        </motion.svg>
      </div>

      {/* Bridge line - continues from SVG bottom to hero section bottom */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px] h-[15vh] sm:h-[12vh] md:h-[10vh] pointer-events-none"
        style={{
          transformOrigin: 'top',
          background: 'rgba(255,255,255,0.5)',
          boxShadow: '0 0 8px rgba(255,255,255,0.3)',
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          duration: 0.3,
          delay: LINE_DURATION * 0.95,
          ease: "linear"
        }}
      />

      {/* Content - Desktop: rises up from behind skyline, Mobile: positioned above skyline */}
      {/* Position: left when news exists, right when no news */}
      <div
        className={`container-wide relative z-10 px-4 sm:px-6 mb-[18vh] sm:mb-[16vh] md:mb-[38vh] ${
          hasNews
            ? 'text-left pl-8 sm:pl-12 md:pl-16 lg:pl-24'
            : 'text-right pr-8 sm:pr-12 md:pr-16 lg:pr-24'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: logoDelay, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ME | Asset Management logo - always on one line */}
          <h1 className="mb-5 sm:mb-6 lg:mb-8 whitespace-nowrap">
            <span className="text-4xl min-[400px]:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-semibold text-white md:text-[#f5f0e8] tracking-normal sm:tracking-wide">
              {company.prefix}
            </span>
            <span className="text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/60 md:text-[#f5f0e8]/50 mx-2 min-[400px]:mx-3 lg:mx-4 font-light">|</span>
            <span className="text-base min-[400px]:text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90 md:text-[#f5f0e8] tracking-[0.04em] sm:tracking-[0.1em] uppercase font-medium">
              {company.name}
            </span>
          </h1>
        </motion.div>
        <motion.p
          className={`text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-white/40 md:text-[#f5f0e8]/50 font-light tracking-wide max-w-sm sm:max-w-lg lg:max-w-xl xl:max-w-2xl ${
            hasNews ? '' : 'ml-auto'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: taglineDelay, ease: [0.22, 1, 0.36, 1] }}
        >
          Investment and Asset Management
        </motion.p>
      </div>
    </section>
  );
}
