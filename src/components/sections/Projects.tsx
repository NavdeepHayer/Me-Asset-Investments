import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Projects() {
  const { projects } = siteContent;
  const featuredProject = projects.items[0];
  const upcomingProjects = projects.items.slice(1);

  return (
    <section className="section-spacing relative overflow-hidden">

      <div className="container-wide relative">
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
              {/* Outer glow/shadow for depth */}
              <div className="absolute -inset-1 bg-gradient-to-b from-white/5 via-transparent to-white/5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Main image with overlay */}
              <div className="relative aspect-[16/9] md:aspect-[2.5/1] overflow-hidden rounded-sm">
                {featuredProject.image ? (
                  <>
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.name}
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Strong gradient overlays to cover image text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A4539] via-[#3A4539]/70 to-[#3A4539]/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3A4539]/80 via-[#3A4539]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#3A4539]" />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(58,69,57,0.6)_100%)]" />
                  </>
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
                  {/* Status badge */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-12 md:right-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm tracking-[0.2em] uppercase bg-white text-[#3A4539] font-medium shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      {featuredProject.status}
                    </span>
                  </div>

                  {/* Project info */}
                  <div className="max-w-2xl relative">
                    {/* Decorative line */}
                    <div className="w-12 h-px bg-white/40 mb-6" />
                    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/70 mb-3 sm:mb-4">
                      {featuredProject.type}
                    </p>
                    <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-3 sm:mb-4 tracking-wide">
                      {featuredProject.name}
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-white/60 font-light tracking-wide">
                      {featuredProject.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent mt-1" />
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
                <div className="group relative">
                  {/* Subtle background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-sm" />

                  <div className="relative border border-white/10 hover:border-white/20 transition-colors duration-500 rounded-sm">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/20 rounded-tl-sm" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/20 rounded-br-sm" />

                    <div className="p-10 sm:p-12 md:p-14 lg:p-16 text-center">
                      {/* Icon */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-8 sm:mb-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-500">
                        <svg
                          className="w-6 h-6 sm:w-7 sm:h-7 text-white/40 group-hover:text-white/60 transition-colors duration-500"
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
                      <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-6 sm:mb-8">
                        {project.status}
                      </p>

                      {/* Title */}
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white/80 mb-3 sm:mb-4 tracking-wide">
                        {project.name}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm sm:text-base text-white/40 tracking-wide">
                        {project.location}
                      </p>
                    </div>
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
