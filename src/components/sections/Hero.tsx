import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Hero() {
  const { hero } = siteContent;

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="container-editorial relative z-10 text-center py-20">
        <motion.h1
          className="text-display max-w-4xl mx-auto mb-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          className="text-body-large text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {hero.subheadline}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
