import { Hero, TextSection, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { GeometricShape } from "../components/ui/GeometricShape";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, globalPresence, philosophy, approach, mission } = siteContent;

  return (
    <>
      <FloatingSocial />

      <main>
        {/* Hero with geometric visual */}
        <Hero />

        {/* Intro */}
        <TextSection text={intro.text} />

        {/* Geometric visual - concentric circles */}
        <GeometricShape variant="circles" align="right" />

        {/* Global Presence */}
        <TextSection text={globalPresence.text} />

        {/* Philosophy */}
        <TextSection text={philosophy.text} />

        {/* Geometric visual - intersecting arcs */}
        <GeometricShape variant="arcs" align="left" />

        {/* Investment Approach */}
        <TextSection text={approach.text} />

        {/* Mission */}
        <TextSection text={mission.text} />

        {/* Geometric visual - abstract towers/buildings */}
        <GeometricShape variant="towers" align="center" />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
