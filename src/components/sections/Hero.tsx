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
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer ring */}
          <motion.circle
            cx="200" cy="200" r="180"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Middle rings */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {/* Center */}
          <circle cx="200" cy="200" r="20" fill="rgba(255,255,255,0.03)" />
          {/* Diagonal lines */}
          <line x1="60" y1="60" x2="340" y2="340" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="340" y1="60" x2="60" y2="340" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          {/* Accent dots */}
          <circle cx="200" cy="20" r="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="200" cy="380" r="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="20" cy="200" r="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="380" cy="200" r="3" fill="rgba(255,255,255,0.15)" />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
