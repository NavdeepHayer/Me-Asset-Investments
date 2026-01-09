import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

export function Header() {
  const { company } = siteContent;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-6 md:py-8">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex items-center justify-between"
        >
          {/* Logo - always on one line */}
          <a href="/" className="inline-flex items-baseline gap-0.5 md:gap-1 group whitespace-nowrap">
            <span className="text-lg min-[400px]:text-xl min-[500px]:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide">
              {company.prefix}
            </span>
            <span className="text-white/30 mx-0.5 min-[400px]:mx-1 md:mx-2">|</span>
            <span className="text-[10px] min-[400px]:text-xs min-[500px]:text-sm md:text-lg lg:text-xl tracking-[0.08em] min-[500px]:tracking-[0.12em] md:tracking-[0.15em] uppercase text-white/50 group-hover:text-white/70 transition-colors duration-300">
              {company.name}
            </span>
          </a>

          {/* Investor Log-In Button */}
          <a
            href="#"
            className="px-4 py-2 text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            Investor Log-In
          </a>
        </motion.div>
      </div>
    </header>
  );
}
