import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  link?: string;
  index: number;
}

function TeamMember({ name, role, bio, link, index }: TeamMemberProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress for this element
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start when element enters viewport, end when it reaches center
    offset: ["start 0.9", "start 0.5"]
  });

  // On desktop: left members come from left, right from right
  // On mobile: alternate left/right based on index
  const isOddIndex = index % 2 === 1;
  const initialX = isOddIndex ? 30 : -30;

  // Animate opacity and x based on scroll
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);

  return (
    <motion.div
      ref={ref}
      data-team-member={index}
      className="h-full"
      style={{ opacity, x }}
    >
      <div className="mb-3 sm:mb-4 lg:mb-6 xl:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white mb-1.5 sm:mb-2 lg:mb-3">
          {name}
        </h3>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 tracking-wide uppercase">
          {role}
        </p>
      </div>
      <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl text-white/60 leading-relaxed font-light">
        {bio}
      </p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm sm:text-base text-white/50 hover:text-white/80 transition-colors duration-300 underline underline-offset-4"
        >
          Visit website
        </a>
      )}
    </motion.div>
  );
}

export function Team() {
  const { team } = siteContent;

  return (
    <section className="section-spacing" data-team-section>
      <div className="container-wide">
        <ScrollReveal>
          <h2
            data-team-heading
            className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white/90 mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center tracking-wide"
          >
            {team.headline}
          </h2>
        </ScrollReveal>

        {/* Grid layout - 1 col mobile, 2 cols desktop */}
        <div data-team-grid className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-x-24 lg:gap-y-20 xl:gap-x-32 xl:gap-y-24 2xl:gap-x-40">
          {team.members.map((member, index) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              bio={member.bio}
              link={"link" in member ? member.link : undefined}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
