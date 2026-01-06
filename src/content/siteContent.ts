export const siteContent = {
  meta: {
    title: "Investment Partners | Long-Term Value Creation",
    description:
      "A private investment firm focused on building enduring value through patient capital and partnership.",
  },

  hero: {
    headline: "Building enduring value through patient capital",
    subheadline:
      "We partner with exceptional founders and management teams to create lasting enterprises.",
  },

  intro: {
    text: "We are a private investment firm with a long-term orientation. Our approach is grounded in patience, partnership, and a deep commitment to the businesses and people we work with. We believe that sustainable value is created over decades, not quarters, and we structure our investments to reflect that conviction.",
  },

  missionStatement: {
    line: "Patient capital. Enduring partnerships. Lasting value.",
  },

  // Full-bleed image sections featuring classical sculpture
  imageFeatures: [
    {
      id: "feature-1",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
      alt: "Classical marble sculpture",
      caption: "Timeless principles guide our approach",
    },
    {
      id: "feature-2",
      src: "https://images.unsplash.com/photo-1584285405429-136bf988919c?w=1400&q=80",
      alt: "Ancient Greek statue",
      caption: "Building for generations",
    },
    {
      id: "feature-3",
      src: "https://images.unsplash.com/photo-1577720643272-265f09367456?w=1400&q=80",
      alt: "Classical sculpture detail",
      caption: "Excellence endures",
    },
  ],

  globalPresence: {
    headline: "Active across markets",
    locations: "New York · London · Singapore · Sydney · Toronto",
  },

  strategy: {
    headline: "What we do",
    paragraphs: [
      "We make long-term investments in established businesses with strong fundamentals and clear paths to sustainable growth. Our capital is patient, allowing management teams to focus on building lasting value rather than meeting arbitrary timelines.",
      "Our investment approach emphasizes partnership over transaction. We seek businesses where we can add meaningful value beyond capital, whether through strategic insight, operational expertise, or access to our broader network of relationships.",
      "We are sector-agnostic but disciplined. We invest where we have conviction, where we understand the business deeply, and where we see an opportunity to support exceptional people in building something meaningful.",
    ],
  },

  focusAreas: {
    headline: "Areas of focus",
    areas: [
      {
        title: "Life Sciences",
        description: "Advancing human health and longevity.",
      },
      {
        title: "Technology",
        description: "Software and platforms shaping the future.",
      },
      {
        title: "Financial Services",
        description: "Innovation in finance and capital markets.",
      },
      {
        title: "Consumer",
        description: "Brands that earn lasting trust.",
      },
    ],
  },

  closingStatement: {
    text: "We believe that the best investments are not transactions but relationships. Our commitment is to the long term, to the people we work with, and to building enterprises that will endure for generations.",
  },

  mailingList: {
    headline: "Stay informed",
    description:
      "Receive occasional updates on our thinking and perspective.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    successMessage: "Thank you for subscribing.",
    errorMessage: "Something went wrong. Please try again.",
  },

  footer: {
    copyright: "Investment Partners",
    socialLinks: [
      { name: "LinkedIn", url: "#" },
      { name: "X", url: "#" },
    ],
    legalLinks: [
      { name: "Privacy", url: "#" },
      { name: "Terms", url: "#" },
    ],
  },
};

export type SiteContent = typeof siteContent;
export type ImageFeature = (typeof siteContent.imageFeatures)[0];
export type FocusArea = (typeof siteContent.focusAreas.areas)[0];
