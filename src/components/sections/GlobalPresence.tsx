import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section className="section-spacing bg-neutral-900 text-white">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <h2 className="text-subheadline text-neutral-400 mb-4">
            {globalPresence.headline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-headline text-white">{globalPresence.locations}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
