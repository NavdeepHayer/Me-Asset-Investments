import { TextSection, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, globalPresence, philosophy, approach, mission } = siteContent;

  return (
    <>
      {/* Floating Social Links */}
      <FloatingSocial />

      <main>
        {/* Intro - Main opening statement */}
        <TextSection text={intro.text} className="pt-32 md:pt-40" />

        {/* Global Presence */}
        <TextSection text={globalPresence.text} />

        {/* Philosophy */}
        <TextSection text={philosophy.text} />

        {/* Investment Approach */}
        <TextSection text={approach.text} />

        {/* Mission */}
        <TextSection text={mission.text} />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
