import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Projects() {
  const { projects } = siteContent;
  const initialCount = projects.initialVisibleCount || 6;
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll
    ? projects.items
    : projects.items.slice(0, initialCount);
  const hasMoreProjects = projects.items.length > initialCount;

  return (
    <section className="section-spacing">
      <div className="container-wide">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16 sm:mb-20 md:mb-24">
            <p className="text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-6">
              Investment Portfolio
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white/90 tracking-wide">
              {projects.headline}
            </h2>
          </div>
        </ScrollReveal>

        {/* Project Grid - scales with any number of projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.name + index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index < initialCount ? index * 0.1 : (index - initialCount) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ScrollReveal delay={index < initialCount ? index * 0.1 : 0}>
                  <div className="group h-full border border-white/10 hover:border-white/25 transition-all duration-500 overflow-hidden">
                    {/* Image area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      {project.image ? (
                        <>
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Subtle overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#3A4539]/60 to-transparent" />
                        </>
                      ) : (
                        // Placeholder for coming soon
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/15 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white/25"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium ${
                            project.status === "Current"
                              ? "bg-white text-[#3A4539]"
                              : project.status === "Completed"
                              ? "bg-emerald-600/90 text-white"
                              : "bg-white/10 text-white/70 backdrop-blur-sm border border-white/10"
                          }`}
                        >
                          {project.status === "Current" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          )}
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <h3 className="font-serif text-2xl sm:text-3xl font-light text-white/90 mb-2 tracking-wide">
                        {project.name}
                      </h3>
                      <p className="text-sm sm:text-base text-white/40 tracking-wider uppercase">
                        {project.location}
                      </p>
                      {project.type && (
                        <p className="text-base sm:text-lg text-white/50 mt-3 font-light">
                          {project.type}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreProjects && (
          <ScrollReveal>
            <div className="mt-12 sm:mt-16 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 transition-all duration-300 tracking-[0.2em] uppercase text-sm"
              >
                <span>{showAll ? "Show Less" : "Show More Projects"}</span>
                <motion.svg
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              {!showAll && (
                <p className="mt-4 text-sm text-white/30">
                  Showing {visibleProjects.length} of {projects.items.length} projects
                </p>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
