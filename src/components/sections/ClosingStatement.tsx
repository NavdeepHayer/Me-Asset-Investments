import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function ClosingStatement() {
  const { closingStatement } = siteContent;

  return (
    <section className="section-spacing">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-subheadline max-w-3xl mx-auto text-neutral-800">
            {closingStatement.text}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
