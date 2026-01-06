import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function FocusAreas() {
  const { focusAreas } = siteContent;

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container-editorial">
        <ScrollReveal>
          <h2 className="text-headline mb-12 lg:mb-16">
            {focusAreas.headline}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {focusAreas.areas.map((area, index) => (
            <ScrollReveal key={area.title} delay={index * 0.05}>
              <div className="group">
                <h3 className="font-serif text-xl lg:text-2xl mb-3 group-hover:text-neutral-600 transition-colors">
                  {area.title}
                </h3>
                <p className="text-caption">{area.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
