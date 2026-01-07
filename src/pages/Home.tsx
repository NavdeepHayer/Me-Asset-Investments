import { Hero, ContentBlock, TextSection, Projects, Team, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { Header } from "../components/ui/Header";
import { PageFlowLine } from "../components/ui/PageFlowLine";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, investmentFocus, savePhilosophy, approach, mission } = siteContent;

  return (
    <>
      <Header />
      <FloatingSocial />
      <PageFlowLine />

      <main>
        {/* Hero with ME branding */}
        <Hero />

        {/* Intro - with UK skyline graphic */}
        <ContentBlock text={intro.text} graphic="ukSkyline" graphicPosition="right" />

        {/* Investment Focus */}
        <TextSection text={investmentFocus.text} />

        {/* SAVE Philosophy - with blueprint graphic */}
        <ContentBlock text={savePhilosophy.text} graphic="blueprint" graphicPosition="left" />

        {/* Investment Approach - with framework graphic */}
        <ContentBlock text={approach.text} graphic="framework" graphicPosition="right" />

        {/* Mission/ESG */}
        <TextSection text={mission.text} />

        {/* Building Cross-Section - full width */}
        <ContentBlock text="" graphic="crossSection" graphicPosition="right" />

        {/* Projects Section */}
        <Projects />

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
