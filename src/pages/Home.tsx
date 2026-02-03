import { useState, useEffect } from "react";
import { Hero, ContentBlock, TextSection, Projects, News, Team, MailingList, Footer } from "../components/sections";
import { Header } from "../components/ui/Header";
import { PageFlowLine } from "../components/ui/PageFlowLine";
import { supabase } from "../lib/supabase";
import { siteContent } from "../content/siteContent";

interface TextContent {
  intro: string;
  investmentFocus: string;
  savePhilosophy: string;
  approach: string;
  mission: string;
}

export function Home() {
  const staticContent = siteContent;
  const [content, setContent] = useState<TextContent>({
    intro: staticContent.intro.text,
    investmentFocus: staticContent.investmentFocus.text,
    savePhilosophy: staticContent.savePhilosophy.text,
    approach: staticContent.approach.text,
    mission: staticContent.mission.text,
  });
  const [_loading, setLoading] = useState(true);

  // Fetch text content from database
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('key, value');

        if (error) {
          console.error('Error fetching site content:', error);
          // Keep using static content as fallback
        } else if (data && data.length > 0) {
          const contentMap: Record<string, string> = {};
          data.forEach((item: { key: string; value: string }) => {
            contentMap[item.key] = item.value;
          });

          setContent({
            intro: contentMap.intro || staticContent.intro.text,
            investmentFocus: contentMap.investmentFocus || staticContent.investmentFocus.text,
            savePhilosophy: contentMap.savePhilosophy || staticContent.savePhilosophy.text,
            approach: contentMap.approach || staticContent.approach.text,
            mission: contentMap.mission || staticContent.mission.text,
          });
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
        // Keep using static content as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="relative overflow-hidden">
      <Header />
      <PageFlowLine />

      <main>
        {/* Hero with ME branding */}
        <Hero />

        {/* Intro - with crane graphic */}
        <ContentBlock text={content.intro} graphic="crane" graphicPosition="right" />

        {/* Investment Focus */}
        <TextSection text={content.investmentFocus} />

        {/* SAVE Philosophy - with blueprint graphic */}
        <ContentBlock text={content.savePhilosophy} graphic="blueprint" graphicPosition="left" />

        {/* Investment Approach - with framework graphic */}
        <ContentBlock text={content.approach} graphic="framework" graphicPosition="right" />

        {/* Mission/ESG */}
        <TextSection text={content.mission} />

        {/* Building Renovation - full width */}
        <ContentBlock text="" graphic="skyline" graphicPosition="right" />

        {/* Projects Section */}
        <Projects />

        {/* Completed Building - represents finished investment */}
        <ContentBlock text="" graphic="completed" graphicPosition="left" />

        {/* Team Section */}
        <Team />

        {/* Document/Signature - deal closing */}
        <ContentBlock text="" graphic="document" graphicPosition="right" />

        {/* News Section */}
        <News />

        {/* Mailing List */}
        <MailingList />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
