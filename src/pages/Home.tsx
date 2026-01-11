import { Hero, ContentBlock, TextSection, Projects, Team, MailingList, Footer } from "../components/sections";
import { Header } from "../components/ui/Header";
import { PageFlowLine } from "../components/ui/PageFlowLine";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, investmentFocus, savePhilosophy, approach, mission } = siteContent;

  return (
    <>
      <Header />
      <PageFlowLine />

      <main>
        {/* Hero with ME branding */}
        <Hero />

        {/* Intro - with crane graphic */}
        <ContentBlock text={intro.text} graphic="crane" graphicPosition="right" />

        {/* Investment Focus */}
        <TextSection text={investmentFocus.text} />

        {/* SAVE Philosophy - with blueprint graphic */}
        <ContentBlock text={savePhilosophy.text} graphic="blueprint" graphicPosition="left" />

        {/* Investment Approach - with framework graphic */}
        <ContentBlock text={approach.text} graphic="framework" graphicPosition="right" />

        {/* Mission/ESG */}
        <TextSection text={mission.text} />

        {/* Building Renovation - full width */}
        <ContentBlock text="" graphic="skyline" graphicPosition="right" />

        {/* Projects Section */}
        <Projects />

        {/* Completed Building - represents finished investment */}
        <ContentBlock text="" graphic="completed" graphicPosition="left" />

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
