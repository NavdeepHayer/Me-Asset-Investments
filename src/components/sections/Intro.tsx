import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function Intro() {
  const { intro } = siteContent;

  return (
    <section className="relative section-spacing overflow-hidden">
      {/* Subtle background image with very light opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]"
        style={{ backgroundImage: `url(${intro.backgroundImage})` }}
      />

      <div className="container-editorial relative z-10">
        <ScrollReveal>
          <p className="text-body-large max-w-3xl leading-relaxed">{intro.text}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
