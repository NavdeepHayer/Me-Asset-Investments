import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Hero() {
  const { hero } = siteContent;

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container-editorial text-center py-20">
        <motion.h1
          className="text-display max-w-5xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          className="text-body-large max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {hero.subheadline}
        </motion.p>
      </div>
    </section>
  );
}
