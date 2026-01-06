import { Hero, TextSection, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { OvalImage } from "../components/ui/OvalImage";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, globalPresence, philosophy, approach, mission } = siteContent;

  return (
    <>
      <FloatingSocial />

      <main>
        {/* Hero with visual */}
        <Hero />

        {/* Intro */}
        <TextSection text={intro.text} />

        {/* Visual moment - classical sculpture */}
        <OvalImage
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
          align="right"
          size="medium"
        />

        {/* Global Presence */}
        <TextSection text={globalPresence.text} />

        {/* Philosophy */}
        <TextSection text={philosophy.text} />

        {/* Visual moment - abstract/architectural */}
        <OvalImage
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
          align="left"
          size="medium"
        />

        {/* Investment Approach */}
        <TextSection text={approach.text} />

        {/* Mission */}
        <TextSection text={mission.text} />

        {/* Visual moment before signup */}
        <OvalImage
          src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80"
          align="center"
          size="small"
        />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
