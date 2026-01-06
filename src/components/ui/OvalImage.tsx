import { ScrollReveal } from "./ScrollReveal";

interface OvalImageProps {
  src: string;
  alt?: string;
  align?: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
}

export function OvalImage({
  src,
  alt = "",
  align = "center",
  size = "medium"
}: OvalImageProps) {
  const sizeClasses = {
    small: "w-[180px] h-[240px] md:w-[200px] md:h-[280px]",
    medium: "w-[220px] h-[300px] md:w-[280px] md:h-[380px]",
    large: "w-[280px] h-[380px] md:w-[340px] md:h-[460px]",
  };

  const alignClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-editorial">
        <ScrollReveal duration={1.2}>
          <div className={`${sizeClasses[size]} ${alignClasses[align]} rounded-[50%] overflow-hidden`}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
