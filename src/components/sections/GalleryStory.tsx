import { ScrollReveal } from "../ui/ScrollReveal";
import type { GalleryStory as GalleryStoryType } from "../../content/siteContent";

interface GalleryStoryProps {
  story: GalleryStoryType;
  layout?: "left" | "right";
}

export function GalleryStory({ story, layout = "left" }: GalleryStoryProps) {
  const isLeft = layout === "left";

  return (
    <section className="section-spacing">
      <div className="container-editorial">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            !isLeft ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Images */}
          <div className={`${!isLeft ? "lg:col-start-2" : ""}`}>
            <div
              className={`grid gap-4 ${
                story.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {story.images.map((image, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="aspect-4/3 overflow-hidden bg-neutral-100">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className={`${!isLeft ? "lg:col-start-1" : ""}`}>
            <ScrollReveal delay={0.2}>
              <h3 className="text-headline mb-6">{story.caption.title}</h3>
              <p className="text-body text-neutral-600">{story.caption.text}</p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
