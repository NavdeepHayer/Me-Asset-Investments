import { siteContent } from "../../content/siteContent";

export function FixedBackground() {
  const { hero } = siteContent;

  return (
    <div className="fixed inset-0 -z-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />
      {/* Consistent dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
