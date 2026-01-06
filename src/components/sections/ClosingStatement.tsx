import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function ClosingStatement() {
  const { closingStatement } = siteContent;

  return (
    <section className="py-32 md:py-40 lg:py-48 bg-white/5 backdrop-blur-sm">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-subheadline max-w-3xl mx-auto text-white leading-relaxed">
            {closingStatement.text}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
