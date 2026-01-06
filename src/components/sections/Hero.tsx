import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1419]" />

      {/* Decorative circle with image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[380px] md:w-[320px] md:h-[440px] lg:w-[380px] lg:h-[520px]"
      >
        <div className="w-full h-full rounded-[50%] overflow-hidden opacity-40">
          <img
            src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="container-editorial relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-display mb-6">
            Investment Partners
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light tracking-wide">
            Long-term value creation
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
