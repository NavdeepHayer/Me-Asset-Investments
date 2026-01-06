import { TextSection, MailingList, Footer } from "../components/sections";
import { FloatingSocial } from "../components/ui/FloatingSocial";
import { Header } from "../components/ui/Header";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { intro, globalPresence, philosophy, approach, mission } = siteContent;

  return (
    <>
      <Header />
      <FloatingSocial />

      <main>
        <TextSection text={intro.text} className="pt-40 md:pt-52" />
        <TextSection text={globalPresence.text} />
        <TextSection text={philosophy.text} />
        <TextSection text={approach.text} />
        <TextSection text={mission.text} />
        <MailingList />
        <Footer />
      </main>
    </>
  );
}
