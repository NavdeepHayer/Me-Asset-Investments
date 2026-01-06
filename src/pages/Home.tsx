import {
  Hero,
  Intro,
  MissionStatement,
  GalleryStory,
  GlobalPresence,
  Strategy,
  FocusAreas,
  ClosingStatement,
  MailingList,
  Footer,
} from "../components/sections";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { galleryStories } = siteContent;

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Intro Section */}
      <Intro />

      {/* Mission Statement */}
      <MissionStatement />

      {/* Gallery Story Sections */}
      {galleryStories.map((story, index) => (
        <GalleryStory
          key={story.id}
          story={story}
          layout={index % 2 === 0 ? "left" : "right"}
        />
      ))}

      {/* Global Presence */}
      <GlobalPresence />

      {/* Strategy / What We Do */}
      <Strategy />

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
