import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { siteContent } from "../../content/siteContent";

interface Project {
  id?: string;
  name: string;
  location: string;
  type: string;
  status: string;
  description: string;
  image: string | null;
  display_order?: number;
  visible?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress for this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.5"],
  });

  // Only alternate left/right on mobile
  const isOddIndex = index % 2 === 1;
  const initialX = isMobile ? (isOddIndex ? 30 : -30) : 0;

  // Animate opacity and x based on scroll
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);

  return (
    <motion.div
      ref={ref}
      className="h-full"
      style={{ opacity, x }}
    >
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
    </motion.div>
  );
}

export function Projects() {
  const { projects: staticProjects } = siteContent;
  const initialCount = staticProjects.initialVisibleCount || 6;
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState<Project[]>(staticProjects.items);
  const [_loading, setLoading] = useState(true);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching projects:', error);
          // Keep using static content as fallback
        } else if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        // Keep using static content as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const visibleProjects = showAll
    ? projects
    : projects.slice(0, initialCount);
  const hasMoreProjects = projects.length > initialCount;

  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.85", "start 0.5"],
  });
  const headingOpacity = useTransform(headingProgress, [0, 1], [0, 1]);
  const headingY = useTransform(headingProgress, [0, 1], [20, 0]);

  return (
    <section className="section-spacing">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          ref={headingRef}
          style={{ opacity: headingOpacity, y: headingY }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <p className="text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-6">
            Investment Portfolio
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white/90 tracking-wide">
            {staticProjects.headline}
          </h2>
        </motion.div>

        {/* Project Grid - scales with any number of projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id || project.name + index}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreProjects && (
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
                Showing {visibleProjects.length} of {projects.length} projects
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
