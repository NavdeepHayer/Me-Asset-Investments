import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Hero() {
  const { company } = siteContent;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          viewBox="0 0 400 400"
          className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] xl:w-[750px] xl:h-[750px] 2xl:w-[850px] 2xl:h-[850px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Middle rings - static base */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Center dot */}
          <circle cx="200" cy="200" r="20" fill="rgba(255,255,255,0.03)" />

          {/* Outer ring - draws on load with delay */}
          <motion.circle
            cx="200" cy="200" r="180"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
          />

          {/* Converging lines - all animate from cardinal points toward bottom center */}
          {/* These build on load, all meeting at the bottom of the circle (200, 380) */}

          {/* Main vertical line from top - most visible */}
          <motion.path
            d="M 200 20 L 200 380"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          />

          {/* From left (9 o'clock) - curves to bottom center */}
          <motion.path
            d="M 20 200 Q 100 200 200 380"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.3, ease: "easeOut" }}
          />

          {/* From right (3 o'clock) - curves to bottom center */}
          <motion.path
            d="M 380 200 Q 300 200 200 380"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.3, ease: "easeOut" }}
          />

          {/* From top-left diagonal - to bottom center */}
          <motion.path
            d="M 60 60 Q 130 200 200 380"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          />

          {/* From top-right diagonal - to bottom center */}
          <motion.path
            d="M 340 60 Q 270 200 200 380"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          />

          {/* Accent dots at cardinal points - appear as lines reach them */}
          <motion.circle
            cx="200" cy="20" r="3"
            fill="rgba(255,255,255,0.2)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
          <motion.circle
            cx="20" cy="200" r="3"
            fill="rgba(255,255,255,0.2)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          />
          <motion.circle
            cx="380" cy="200" r="3"
            fill="rgba(255,255,255,0.2)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          />

          {/* Convergence point at bottom - glows after lines converge */}
          <motion.circle
            cx="200" cy="380" r="5"
            fill="rgba(255,255,255,0.25)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      {/* Flow line extends from convergence point to bottom of hero */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px pointer-events-none origin-top"
        style={{ height: '15vh' }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.2, delay: 3, ease: "easeOut" }}
      >
        <div className="w-full h-full bg-gradient-to-b from-white/15 to-white/10" />
      </motion.div>

      {/* Content */}
      <div className="container-wide relative z-10 text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ME | Asset Management logo treatment - stacked on mobile */}
          <h1 className="mb-5 sm:mb-6 lg:mb-8">
            <span className="block sm:inline text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-semibold text-white tracking-wide">
              {company.prefix}
            </span>
            <span className="hidden sm:inline text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/30 mx-3 lg:mx-4 font-light">|</span>
            <span className="block sm:inline mt-2 sm:mt-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white/70 tracking-[0.15em] sm:tracking-[0.1em] uppercase font-light">
              {company.name}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl text-white/40 font-light tracking-wide max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            Strategic property investment and asset management
          </p>
        </motion.div>
      </div>
    </section>
  );
}
