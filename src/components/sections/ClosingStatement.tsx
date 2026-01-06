import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function ClosingStatement() {
  const { closingStatement } = siteContent;

  return (
    <section className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${closingStatement.backgroundImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="container-editorial relative z-10 text-center">
        <ScrollReveal>
          <p className="text-subheadline max-w-3xl mx-auto text-white leading-relaxed">
            {closingStatement.text}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
