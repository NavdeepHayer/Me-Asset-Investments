import { ScrollReveal } from "../ui/ScrollReveal";
import type { ImageFeature as ImageFeatureType } from "../../content/siteContent";

interface ImageFeatureProps {
  feature: ImageFeatureType;
}

export function ImageFeature({ feature }: ImageFeatureProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <img
          src={feature.src}
          alt={feature.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Caption */}
      <div className="container-editorial relative z-10 pb-12 md:pb-16 lg:pb-20">
        <ScrollReveal>
          <p className="text-caption uppercase tracking-widest">
            {feature.caption}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
