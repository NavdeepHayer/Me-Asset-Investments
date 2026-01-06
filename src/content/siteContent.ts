export const siteContent = {
  meta: {
    title: "Investment Partners | Long-Term Value Creation",
    description:
      "A private investment firm focused on building enduring value through patient capital and partnership.",
  },

  // Main intro text block - like Apeiron's opening statement
  intro: {
    text: "As entrepreneurs at heart, we pride ourselves on being hands-on, reliable, and long-term partners – committed to supporting exceptional founders of companies as well as emerging asset managers in pushing the boundaries of imagination and shaping the future we aspire to live in.",
  },

  // Global presence section
  globalPresence: {
    text: "With teams in New York, London, Singapore, Sydney, and Toronto, we apply a global, multi-strategy investment approach, with a primary focus on building lasting enterprises.",
  },

  // Core philosophy
  philosophy: {
    text: "At our core, we are driven by a bold optimism for a future where technology empowers people to live longer, healthier, and more fulfilling lives.",
  },

  // Investment approach
  approach: {
    text: "Through our proprietary balance sheet, our direct investment approach encompasses the entire company lifecycle – from incubating and accelerating breakthrough ideas to scaling growth-stage businesses as well as making impactful investments in established companies.",
  },

  // Mission/values
  mission: {
    text: "We believe in advancing progress to help usher in an era of physical and mental abundance. Our commitment is to the long term, to the people we work with, and to building enterprises that will endure for generations.",
  },

  // Featured quote for visual interest
  pullQuote: {
    text: "Building enterprises that will endure for generations.",
  },

  mailingList: {
    headline: "GET REGULAR UPDATES BY JOINING OUR MAILING LIST.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    buttonText: "Subscribe",
    successMessage: "Thank you for subscribing.",
    errorMessage: "Something went wrong. Please try again.",
  },

  footer: {
    copyright: "Investment Partners",
    socialLinks: [
      { name: "Substack", url: "#", icon: "substack" },
      { name: "X", url: "#", icon: "x" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
    ],
    legalLinks: [
      { name: "Privacy", url: "#" },
      { name: "Terms", url: "#" },
      { name: "Imprint", url: "#" },
    ],
  },
};

export type SiteContent = typeof siteContent;
