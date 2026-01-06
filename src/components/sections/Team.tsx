import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Team() {
  const { team } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-wide">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white/90 mb-16 md:mb-20 lg:mb-24 xl:mb-28 text-center tracking-wide">
            {team.headline}
          </h2>
        </ScrollReveal>

        {/* Grid layout - 1 col mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-x-24 lg:gap-y-20 xl:gap-x-32 xl:gap-y-24 2xl:gap-x-40">
          {team.members.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 0.1}>
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 lg:mb-6 xl:mb-8">
                  <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white mb-2 lg:mb-3">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl text-white/40 tracking-wide uppercase">
                    {member.role}
                  </p>
                </div>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white/60 leading-relaxed font-light">
                  {member.bio}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
