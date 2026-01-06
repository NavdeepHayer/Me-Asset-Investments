import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ImageBreak as ImageBreakType } from "../../content/siteContent";

interface ImageBreakProps {
  image: ImageBreakType;
}

export function ImageBreak({ image }: ImageBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ y }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}
