import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Intro() {
  const { intro } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-editorial">
        <ScrollReveal>
          <p className="text-body-large max-w-3xl leading-relaxed text-white/90">
            {intro.text}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
