import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "../ui/ScrollReveal";
import { supabase } from "../../lib/supabase";
import { siteContent } from "../../content/siteContent";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  link?: string;
  linkedin_url?: string;
  display_order?: number;
  visible?: boolean;
}

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  link?: string;
  linkedin_url?: string;
  index: number;
}

function TeamMember({ name, role, bio, link, linkedin_url, index }: TeamMemberProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress for this element
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start when element is closer to center, end when above center
    // This delays the fade-in to sync better with the flow line
    offset: ["start 0.7", "start 0.4"]
  });

  // Even indices (0, 2, 4): Name on LEFT, Bio on RIGHT
  // Odd indices (1, 3, 5): Bio on LEFT, Name on RIGHT
  const isOddIndex = index % 2 === 1;
  const initialX = isOddIndex ? 30 : -30;

  // Animate opacity and x based on scroll
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);

  // Name/role section
  const nameSection = (
    <div className="lg:w-[35%] lg:flex-shrink-0">
      <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-1.5 sm:mb-2 lg:mb-3">
        {name}
      </h3>
      <div className="flex items-center gap-3">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/40 tracking-wide uppercase">
          {role}
        </p>
        {linkedin_url && (
          <a
            href={linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors duration-300"
            aria-label={`${name}'s LinkedIn profile`}
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
      </div>
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
    </div>
  );

  // Bio section
  const bioSection = (
    <div className="lg:flex-1">
      <p className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-white/60 leading-relaxed font-light whitespace-pre-line">
        {bio}
      </p>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      data-team-member={index}
      data-team-member-side={isOddIndex ? 'right' : 'left'}
      style={{ opacity, x }}
    >
      {/* Mobile: Stack vertically */}
      <div className="lg:hidden mb-3 sm:mb-4">
        <h3 className="text-2xl sm:text-3xl md:text-3xl font-light text-white mb-1.5 sm:mb-2">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm sm:text-base md:text-lg text-white/40 tracking-wide uppercase">
            {role}
          </p>
          {linkedin_url && (
            <a
              href={linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/80 transition-colors duration-300"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
      <p className="lg:hidden text-lg sm:text-xl md:text-xl text-white/60 leading-relaxed font-light whitespace-pre-line">
        {bio}
      </p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hidden inline-block mt-4 text-sm sm:text-base text-white/50 hover:text-white/80 transition-colors duration-300 underline underline-offset-4"
        >
          Visit website
        </a>
      )}

      {/* Desktop: Horizontal row with alternating sides */}
      <div className={`hidden lg:flex items-start gap-12 xl:gap-16 2xl:gap-20 ${isOddIndex ? 'flex-row-reverse' : 'flex-row'}`}>
        {nameSection}
        {bioSection}
      </div>
    </motion.div>
  );
}

export function Team() {
  const { team: staticTeam } = siteContent;
  const [members, setMembers] = useState<TeamMember[]>(staticTeam.members);
  const [_loading, setLoading] = useState(true);

  // Fetch team members from database
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching team members:', error);
          // Keep using static content as fallback
        } else if (data && data.length > 0) {
          setMembers(data);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        // Keep using static content as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <section className="section-spacing" data-team-section>
      <div className="container-wide">
        <ScrollReveal>
          <h2
            data-team-heading
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white/90 mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center tracking-wide"
          >
            {staticTeam.headline}
          </h2>
        </ScrollReveal>

        {/* Stacked list layout - full width rows */}
        <div data-team-grid className="flex flex-col gap-16 sm:gap-20 md:gap-24 lg:gap-28 xl:gap-32">
          {members.map((member, index) => (
            <TeamMember
              key={member.id || member.name}
              name={member.name}
              role={member.role}
              bio={member.bio}
              link={member.link}
              linkedin_url={member.linkedin_url}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
