import { Hero, TextSection, Team, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { Header } from "../components/ui/Header";
import { GeometricShape } from "../components/ui/GeometricShape";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, investmentFocus, savePhilosophy, approach, mission } = siteContent;

  return (
    <>
      <Header />
      <FloatingSocial />

      <main>
        {/* Hero with ME branding */}
        <Hero />

        {/* Intro */}
        <TextSection text={intro.text} />

        {/* Geometric visual - concentric circles */}
        <GeometricShape variant="circles" align="right" />

        {/* Investment Focus */}
        <TextSection text={investmentFocus.text} />

        {/* SAVE Philosophy */}
        <TextSection text={savePhilosophy.text} />

        {/* Geometric visual - intersecting arcs */}
        <GeometricShape variant="arcs" align="left" />

        {/* Investment Approach - 3 buckets */}
        <TextSection text={approach.text} />

        {/* Mission/ESG */}
        <TextSection text={mission.text} />

        {/* Geometric visual - abstract towers/buildings */}
        <GeometricShape variant="towers" align="center" />

        {/* Team Section */}
        <Team />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
