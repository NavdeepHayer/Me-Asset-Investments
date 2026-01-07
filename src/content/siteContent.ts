export const siteContent = {
  meta: {
    title: "ME Asset Management | Strategic Property Investment",
    description:
      "A discretionary investment firm specializing in income-producing real estate assets across hotels, student housing, and commercial properties.",
  },

  // Company name for header
  company: {
    prefix: "ME",
    name: "Asset Management",
  },

  // Main intro text block
  intro: {
    text: "ME Asset Management is a discretionary investment firm focused on acquiring, enhancing, and managing income-producing real estate assets. We take a hands-on approach to value creation, working closely with our partners to unlock the full potential of every property in our portfolio.",
  },

  // Investment focus
  investmentFocus: {
    text: "Our investment platform spans hotels, student housing, offices, and other income-generating properties. We identify undervalued assets with strong fundamentals and apply our expertise to drive sustainable returns for our investors.",
  },

  // SAVE philosophy - Stranded Assets Value Enhancement
  savePhilosophy: {
    text: "Through our SAVE approach – Stranded Assets Value Enhancement – we specialize in repositioning properties that have been overlooked or underperforming. By integrating ESG principles and asset improvement strategies, we transform these opportunities into high-performing investments.",
  },

  // Investment approach - the 3 buckets
  approach: {
    text: "Our multi-strategy platform operates across three core areas: acquiring and holding quality assets for long-term income, identifying remediation opportunities to unlock hidden value, and selectively pursuing undervalued secondary market opportunities.",
  },

  // Mission/commitment
  mission: {
    text: "We are committed to responsible investing and sustainable value creation. Our focus on Environmental, Social, and Governance principles ensures that our investments deliver returns while contributing positively to communities and the environment.",
  },

  // Team
  team: {
    headline: "Our Team",
    members: [
      {
        name: "Paul Thandi",
        role: "Chairman",
        bio: "Paul is a Private Equity investor, Board Member and the former CEO and Chairman of the NEC Group (Birmingham), successfully growing the NEC over 15 years to a $1 Billion exit to Blackstone in 2018. Paul is also Chairman of BOXPARK, Chairman of Student Energy Group, Sostratus Energy, Just Ask A Question (JAAQ) and is a patron of Marie Curie and Heads Together.",
      },
      {
        name: "Verender S. Badial",
        role: "CEO",
        bio: "Strategic advisor and former investment banker with over 20 years' leadership in global capital markets. Track record spanning technology and large-scale real estate, consistently scaling high-growth ventures and delivering long-term shareholder value.",
      },
      {
        name: "Tarvy Gosal & Jas Randhawa",
        role: "Managing Directors, Fleetwood Architectural Aluminium",
        bio: "Fleetwood Architectural Aluminium are experts and one of the UK leaders in recladding non-compliant buildings and deliver high-quality building envelopes, on time every time. FAA is on track to exceed £40+ million revenues by end of 2025.",
      },
      {
        name: "Michael Mirelman & Daniel Benton",
        role: "Directors, GRE Finance",
        bio: "Each having had 20+ years' experience working across the finance, banking, and real estate sectors, and alongside property developers, investors, and family offices. Recently, both have led over £150+ million real estate finance, development and portfolio management.",
      },
    ],
  },

  mailingList: {
    headline: "Stay informed. Join our mailing list for updates on our portfolio and opportunities.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    buttonText: "Subscribe",
    successMessage: "Thank you for subscribing.",
    errorMessage: "Something went wrong. Please try again.",
  },

  footer: {
    copyright: "ME Asset Management",
    contact: {
      email: "verender@meassetmanagement.com",
      person: "Verender Badial",
    },
    socialLinks: [
      { name: "LinkedIn", url: "#", icon: "linkedin" },
    ],
    legalLinks: [
      { name: "Privacy", url: "#" },
      { name: "Terms", url: "#" },
    ],
  },
};

export type SiteContent = typeof siteContent;
