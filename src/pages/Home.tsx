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
  ImageBreak,
} from "../components/sections";
import { siteContent } from "../content/siteContent";

export function Home() {
  const { galleryStories, imageBreaks } = siteContent;

  return (
    <main>
      {/* Hero Section - Full bleed background image */}
      <Hero />

      {/* Intro Section */}
      <Intro />

      {/* Mission Statement */}
      <MissionStatement />

      {/* First Gallery Story */}
      {galleryStories[0] && (
        <GalleryStory story={galleryStories[0]} layout="left" />
      )}

      {/* Image Break - Visual pause */}
      {imageBreaks[0] && <ImageBreak image={imageBreaks[0]} />}

      {/* Second Gallery Story */}
      {galleryStories[1] && (
        <GalleryStory story={galleryStories[1]} layout="right" />
      )}

      {/* Third Gallery Story */}
      {galleryStories[2] && (
        <GalleryStory story={galleryStories[2]} layout="left" />
      )}

      {/* Global Presence - Dark section with background */}
      <GlobalPresence />

      {/* Strategy / What We Do */}
      <Strategy />

      {/* Image Break - Visual pause */}
      {imageBreaks[1] && <ImageBreak image={imageBreaks[1]} />}

      {/* Focus Areas */}
      <FocusAreas />

      {/* Closing Statement - Full bleed background */}
      <ClosingStatement />

      {/* Mailing List */}
      <MailingList />

      {/* Footer */}
      <Footer />
    </main>
  );
}
