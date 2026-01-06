import { Hero, ContentBlock, TextSection, Team, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { Header } from "../components/ui/Header";
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

        {/* Intro - with grid graphic on right (desktop) */}
        <ContentBlock text={intro.text} graphic="grid" graphicPosition="right" />

        {/* Investment Focus */}
        <TextSection text={investmentFocus.text} />

        {/* SAVE Philosophy - with lines graphic on left (desktop) */}
        <ContentBlock text={savePhilosophy.text} graphic="lines" graphicPosition="left" />

        {/* Investment Approach - with dots graphic on right */}
        <ContentBlock text={approach.text} graphic="dots" graphicPosition="right" />

        {/* Mission/ESG */}
        <TextSection text={mission.text} />

        {/* City skyline - full width */}
        <ContentBlock text="" graphic="towers" graphicPosition="right" />

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
