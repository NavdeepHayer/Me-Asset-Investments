import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section className="py-32 md:py-40 lg:py-48 bg-white/5 backdrop-blur-sm">
      <div className="container-editorial text-center">
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
