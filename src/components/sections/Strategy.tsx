import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Strategy() {
  const { strategy } = siteContent;

  return (
    <section className="relative section-spacing overflow-hidden">
      {/* Background Image with subtle opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.04]"
        style={{ backgroundImage: `url(${strategy.backgroundImage})` }}
      />

      <div className="container-editorial relative z-10">
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
