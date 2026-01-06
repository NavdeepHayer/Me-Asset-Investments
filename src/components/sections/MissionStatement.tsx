import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function MissionStatement() {
  const { missionStatement } = siteContent;

  return (
    <section className="section-spacing-sm">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-subheadline italic text-white/70">
            {missionStatement.line}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
