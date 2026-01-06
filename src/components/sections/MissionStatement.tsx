import { ScrollReveal } from "../ui/ScrollReveal";
import { siteContent } from "../../content/siteContent";

export function MissionStatement() {
  const { missionStatement } = siteContent;

  return (
    <section className="section-spacing-sm bg-white/5 backdrop-blur-sm">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <p className="text-subheadline text-white/90 italic">
            {missionStatement.line}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
