import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Projects() {
  const { projects } = siteContent;
  const featuredProject = projects.items[0];
  const upcomingProjects = projects.items.slice(1);

  return (
    <section className="section-spacing">
      <div className="container-wide">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16 sm:mb-20 md:mb-28 lg:mb-32">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-6">
              Investment Portfolio
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white/90 tracking-wide">
              {projects.headline}
            </h2>
          </div>
        </ScrollReveal>

        {/* Featured Project */}
        <ScrollReveal>
          <motion.div
            className="mb-16 sm:mb-20 md:mb-28"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative">
              {/* Main image with overlay */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                {featuredProject.image ? (
                  <>
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A4539] via-[#3A4539]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3A4539]/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
                  {/* Status badge */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-12 md:right-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm tracking-[0.2em] uppercase bg-white text-[#3A4539] font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {featuredProject.status}
                    </span>
                  </div>

                  {/* Project info */}
                  <div className="max-w-2xl">
                    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/50 mb-2 sm:mb-3">
                      {featuredProject.type}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2 sm:mb-4 tracking-wide">
                      {featuredProject.name}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-white/60 font-light tracking-wide">
                      {featuredProject.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Upcoming Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {upcomingProjects.map((project, index) => (
            <ScrollReveal key={project.name + index} delay={index * 0.15}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="group relative border border-white/10 hover:border-white/20 transition-colors duration-500">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/30" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/30" />

                  <div className="p-8 sm:p-10 md:p-12 lg:p-14 text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 sm:mb-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/30 transition-colors duration-500">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white/40"
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

                    {/* Status */}
                    <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-6">
                      {project.status}
                    </p>

                    {/* Title */}
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-white/70 mb-2 sm:mb-3 tracking-wide">
                      {project.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm text-white/40 tracking-wide">
                      {project.location}
                    </p>
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
