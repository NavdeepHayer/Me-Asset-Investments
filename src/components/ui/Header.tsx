import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-8 md:py-10">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <a href="/" className="inline-block group">
            <span className="text-sm md:text-base tracking-[0.3em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-300">
              Investment Partners
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
