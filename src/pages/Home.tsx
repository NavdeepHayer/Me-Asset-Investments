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

        {/* Intro - with construction crane graphic */}
        <ContentBlock text={intro.text} graphic="crane" graphicPosition="right" />

        {/* Investment Focus */}
        <TextSection text={investmentFocus.text} />

        {/* SAVE Philosophy - with blueprint graphic */}
        <ContentBlock text={savePhilosophy.text} graphic="blueprint" graphicPosition="left" />

        {/* Investment Approach - with framework graphic */}
        <ContentBlock text={approach.text} graphic="framework" graphicPosition="right" />

        {/* Mission/ESG */}
        <TextSection text={mission.text} />

        {/* City skyline - full width */}
        <ContentBlock text="" graphic="skyline" graphicPosition="right" />

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
