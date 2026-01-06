import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Strategy() {
  const { strategy } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-editorial">
        <ScrollReveal>
          <h2 className="text-headline mb-12 lg:mb-16">{strategy.headline}</h2>
        </ScrollReveal>
        <div className="max-w-3xl space-y-8">
          {strategy.paragraphs.map((paragraph, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <p className="text-body text-neutral-700">{paragraph}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
