import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";
import { InvestorLoginModal } from "./InvestorLoginModal";

export function Header() {
  const { company } = siteContent;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
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
              <span className="text-xs min-[400px]:text-sm min-[500px]:text-base md:text-xl lg:text-2xl tracking-[0.08em] min-[500px]:tracking-[0.12em] md:tracking-[0.15em] uppercase text-white/70 group-hover:text-white/90 font-medium transition-colors duration-300">
                {company.name}
              </span>
            </a>

            {/* Investor Log-In Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
              {/* Mobile: compact version */}
              <span className="md:hidden text-[10px] tracking-[0.1em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                Login
              </span>
              {/* Desktop: full version */}
              <span className="hidden md:inline text-base font-semibold text-white/70 group-hover:text-white tracking-wide">
                ME
              </span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="hidden md:inline text-xs tracking-[0.15em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                Investor Login
              </span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Investor Login Modal */}
      <InvestorLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
