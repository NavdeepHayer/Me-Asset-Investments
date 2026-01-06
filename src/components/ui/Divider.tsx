import { ScrollReveal } from "./ScrollReveal";

interface DividerProps {
  variant?: "line" | "dots" | "ornament";
  className?: string;
}

export function Divider({ variant = "line", className = "" }: DividerProps) {
  return (
    <div className={`py-8 md:py-12 ${className}`}>
      <ScrollReveal duration={0.6} distance={20}>
        <div className="container-editorial flex justify-center">
          {variant === "line" && (
            <div className="w-16 h-px bg-white/20" />
          )}
          {variant === "dots" && (
            <div className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          )}
          {variant === "ornament" && (
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-white/20" />
              <span className="text-white/30 text-sm">✦</span>
              <div className="w-8 h-px bg-white/20" />
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
