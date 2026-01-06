import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Header() {
  const { meta } = siteContent;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-6 md:py-8">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="/" className="inline-block">
            <span className="font-serif text-lg md:text-xl tracking-widest text-white/90 hover:text-white transition-colors uppercase">
              {meta.title}
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
