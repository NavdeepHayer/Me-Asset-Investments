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

  galleryStories: [
    {
      id: "story-1",
      images: [
        {
          src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
          alt: "Modern architecture with clean lines",
        },
        {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          alt: "Minimalist office space",
        },
      ],
      caption: {
        title: "Thoughtful stewardship",
        text: "We approach each investment as a long-term partnership. Our role extends beyond capital to include strategic guidance, operational support, and access to a network built over decades of careful relationship building.",
      },
    },
    {
      id: "story-2",
      images: [
        {
          src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
          alt: "Team collaboration",
        },
      ],
      caption: {
        title: "Partnership in practice",
        text: "We work alongside the leaders of our portfolio companies as true partners. This means being available when needed, providing perspective without imposing, and always prioritizing the long-term health of the enterprise over short-term metrics.",
      },
    },
    {
      id: "story-3",
      images: [
        {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
          alt: "Data and analytics",
        },
        {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          alt: "Strategic planning",
        },
      ],
      caption: {
        title: "Measured growth",
        text: "Sustainable growth requires patience and discipline. We favor steady progress over rapid expansion, understanding that the most valuable enterprises are built through consistent execution over time.",
      },
    },
  ],

  globalPresence: {
    headline: "Active across markets",
    locations: "New York, London, Singapore, Sydney, Toronto",
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
        title: "Business Services",
        description:
          "Essential services that form the infrastructure of modern commerce.",
      },
      {
        title: "Healthcare",
        description:
          "Companies improving access, quality, and efficiency in healthcare delivery.",
      },
      {
        title: "Technology",
        description:
          "Software and technology-enabled businesses with sustainable competitive advantages.",
      },
      {
        title: "Consumer",
        description:
          "Brands and businesses that have earned lasting consumer trust.",
      },
      {
        title: "Industrial",
        description:
          "Manufacturing and industrial businesses with strong market positions.",
      },
      {
        title: "Financial Services",
        description:
          "Specialty finance and services businesses with disciplined underwriting.",
      },
    ],
  },

  closingStatement: {
    text: "We believe that the best investments are not transactions but relationships. Our commitment is to the long term, to the people we work with, and to building enterprises that will endure for generations.",
  },

  mailingList: {
    headline: "Stay informed",
    description:
      "Receive occasional updates on our thinking and perspective on long-term value creation.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    successMessage: "Thank you for subscribing.",
    errorMessage: "Something went wrong. Please try again.",
  },

  footer: {
    copyright: "Investment Partners",
    socialLinks: [
      { name: "LinkedIn", url: "#" },
      { name: "Twitter", url: "#" },
    ],
    legalLinks: [
      { name: "Privacy Policy", url: "#" },
      { name: "Terms of Use", url: "#" },
    ],
  },
};

export type SiteContent = typeof siteContent;
export type GalleryStory = (typeof siteContent.galleryStories)[0];
export type FocusArea = (typeof siteContent.focusAreas.areas)[0];
