import { TextSection, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { Header } from "../components/ui/Header";
import { Divider } from "../components/ui/Divider";
import { PullQuote } from "../components/ui/PullQuote";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, globalPresence, philosophy, approach, mission, pullQuote } = siteContent;

  return (
    <>
      {/* Fixed Header */}
      <Header />

      {/* Floating Social Links */}
      <FloatingSocial />

      <main>
        {/* Intro - Main opening statement */}
        <TextSection text={intro.text} className="pt-32 md:pt-40" />

        {/* Divider */}
        <Divider variant="dots" />

        {/* Global Presence */}
        <TextSection text={globalPresence.text} />

        {/* Philosophy */}
        <TextSection text={philosophy.text} />

        {/* Divider */}
        <Divider variant="ornament" />

        {/* Investment Approach */}
        <TextSection text={approach.text} />

        {/* Pull Quote - Visual highlight */}
        <PullQuote text={pullQuote.text} />

        {/* Mission */}
        <TextSection text={mission.text} />

        {/* Divider before mailing list */}
        <Divider variant="line" />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
