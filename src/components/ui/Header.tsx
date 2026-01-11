import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "../../content/siteContent";
import { InvestorLoginModal } from "./InvestorLoginModal";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
  const { company } = siteContent;
  const { user, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

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

            {/* Investor Button - Shows Login or User Menu */}
            {user ? (
              // Logged in - show dropdown menu
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 transition-all duration-300 group"
                >
                  <span className="text-xs md:text-base font-semibold text-white/70 group-hover:text-white tracking-wide">
                    ME
                  </span>
                  <span className="text-white/30 text-xs md:text-base">|</span>
                  <span className="text-[8px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                    Dashboard
                  </span>
                  <svg
                    className={`w-3 h-3 md:w-4 md:h-4 text-white/40 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-[#2d382c] border border-white/20 shadow-xl"
                    >
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Not logged in - show login button
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                <span className="text-xs md:text-base font-semibold text-white/70 group-hover:text-white tracking-wide">
                  ME
                </span>
                <span className="text-white/30 text-xs md:text-base">|</span>
                <span className="text-[8px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                  Investor Login
                </span>
              </button>
            )}
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
