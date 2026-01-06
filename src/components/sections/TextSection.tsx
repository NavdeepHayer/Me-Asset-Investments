import { ScrollReveal } from "../ui/ScrollReveal";

interface TextSectionProps {
  text: string;
  className?: string;
}

export function TextSection({ text, className = "" }: TextSectionProps) {
  return (
    <section className={`section-spacing ${className}`}>
      <div className="container-editorial">
        <ScrollReveal duration={1} distance={50}>
          <p className="text-body-large">{text}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
