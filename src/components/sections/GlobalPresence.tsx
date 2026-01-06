import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${globalPresence.backgroundImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="container-editorial relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl text-white/60 mb-6 tracking-wide uppercase">
            {globalPresence.headline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-headline text-white">{globalPresence.locations}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
