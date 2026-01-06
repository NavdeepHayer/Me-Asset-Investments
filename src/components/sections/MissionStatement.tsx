import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function MissionStatement() {
  const { missionStatement } = siteContent;

  return (
    <section className="section-spacing-sm bg-neutral-50">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-subheadline text-neutral-700 italic">
            {missionStatement.line}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
