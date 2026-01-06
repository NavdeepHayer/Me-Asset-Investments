import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-caption uppercase tracking-widest mb-6">
            {globalPresence.headline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-headline">{globalPresence.locations}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
