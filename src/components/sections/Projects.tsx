import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Projects() {
  const { projects } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-wide">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white/90 mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center tracking-wide">
            {projects.headline}
          </h2>
        </ScrollReveal>

        {/* Grid layout - 1 col mobile, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {projects.items.map((project, index) => (
            <ScrollReveal key={project.name + index} delay={index * 0.15}>
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="group relative overflow-hidden rounded-sm bg-white/5 h-full flex flex-col">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/10">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-white/20 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm text-white/30 tracking-widest uppercase">
                            Confidential
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <span
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-medium rounded-sm ${
                          project.status === "Acquired"
                            ? "bg-white/90 text-[#3A4539]"
                            : "bg-white/20 text-white/80 backdrop-blur-sm"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white mb-1 sm:mb-2">
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/40 tracking-wide uppercase mb-2 sm:mb-3">
                      {project.location}
                    </p>
                    {project.type && (
                      <p className="text-sm sm:text-base text-white/60 font-light">
                        {project.type}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
