import {
  Hero,
  Intro,
  MissionStatement,
  ImageFeature,
  GlobalPresence,
  Strategy,
  FocusAreas,
  ClosingStatement,
  MailingList,
  Footer,
} from "../components/sections";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { imageFeatures } = siteContent;

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* First Image Feature */}
      {imageFeatures[0] && <ImageFeature feature={imageFeatures[0]} />}

      {/* Intro Section */}
      <Intro />

      {/* Mission Statement */}
      <MissionStatement />

      {/* Second Image Feature */}
      {imageFeatures[1] && <ImageFeature feature={imageFeatures[1]} />}

      {/* Global Presence */}
      <GlobalPresence />

      {/* Strategy / What We Do */}
      <Strategy />

      {/* Third Image Feature */}
      {imageFeatures[2] && <ImageFeature feature={imageFeatures[2]} />}

      {/* Focus Areas */}
      <FocusAreas />

      {/* Closing Statement */}
      <ClosingStatement />

      {/* Mailing List */}
      <MailingList />

      {/* Footer */}
      <Footer />
    </main>
  );
}
