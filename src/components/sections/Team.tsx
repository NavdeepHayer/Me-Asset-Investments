import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Team() {
  const { team } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-editorial">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-16 md:mb-20 text-center tracking-wide">
            {team.headline}
          </h2>
        </ScrollReveal>

        <div className="space-y-16 md:space-y-20">
          {team.members.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 0.1}>
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-light text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-white/40 tracking-wide uppercase">
                    {member.role}
                  </p>
                </div>
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
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
