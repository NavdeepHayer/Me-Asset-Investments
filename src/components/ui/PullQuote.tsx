import { ScrollReveal } from "./ScrollReveal";

interface PullQuoteProps {
  text: string;
  className?: string;
}

export function PullQuote({ text, className = "" }: PullQuoteProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container-editorial">
        <ScrollReveal duration={1.2} distance={60}>
          <blockquote className="relative">
            <span className="absolute -top-8 -left-2 text-6xl md:text-8xl text-white/10 font-serif select-none">
              "
            </span>
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif leading-[1.4] text-white/95 italic pl-4 border-l-2 border-white/20">
              {text}
            </p>
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  );
}
