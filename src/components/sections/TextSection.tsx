import { ScrollReveal } from "../ui/ScrollReveal";

interface TextSectionProps {
  text: string;
  className?: string;
}

export function TextSection({ text, className = "" }: TextSectionProps) {
  return (
    <section className={`section-spacing ${className}`}>
      <div className="container-editorial">
        <ScrollReveal>
          <p className="text-body-large">{text}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
