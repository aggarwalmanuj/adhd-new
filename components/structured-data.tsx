// JSON-LD structured data. This does not create backlinks, but it tells search
// engines that AIMERGE, Manuj Aggarwal, and TetraNoodle are one connected entity
// graph — so the few links the site does earn are attributed to a recognised
// organisation rather than an anonymous URL. @id values are shared across the
// graph so the nodes reference each other.
const SITE = "https://adhd.aimerge.live";

// Same-entity profiles. Add the brand's public X / YouTube URLs here as they go
// live — each one strengthens entity recognition.
const ORG_SAME_AS = [
  "https://www.aimerge.live",
  "https://tetranoodle.com",
  "https://www.linkedin.com/company/tetranoodle",
];

// Manuj's public author / speaker / social profiles.
const FOUNDER_SAME_AS: string[] = [
  "https://www.linkedin.com/in/manujaggarwal",
  "https://manujaggarwal.com",
  "https://manuj.ca",
];

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "AIMERGE",
      url: SITE,
      logo: `${SITE}/icon/logo.png`,
      email: "feedback@tetranoodle.com",
      description:
        "AI Merge offers the free ADHD Belief Score: a personalized, reflective Pattern-to-Belief Map built from a participant's own words. Educational and reflective; not a diagnosis.",
      founder: { "@id": `${SITE}/#manuj` },
      parentOrganization: {
        "@type": "Organization",
        name: "TetraNoodle Technologies",
        url: "https://tetranoodle.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vancouver",
          addressCountry: "CA",
        },
      },
      sameAs: ORG_SAME_AS,
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#manuj`,
      name: "Manuj Aggarwal",
      jobTitle: "Founder",
      image: `${SITE}/manuj/b76742c9-4955-439c-8a3e-e66d1b07fd3b.jpg`,
      worksFor: { "@id": `${SITE}/#organization` },
      description:
        "Founder of AIMERGE and TetraNoodle Technologies. 25-year technology career shipping AI systems with teams at IBM, Microsoft, Pearson, T-Mobile, and the United Nations.",
      sameAs: FOUNDER_SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "AIMERGE",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en",
    },
    {
      // Mirrors the visible "Essential Questions" accordion 1:1 — Google
      // penalizes FAQ markup that diverges from on-page content.
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does the ADHD Belief Score claim belief causes ADHD?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. ADHD is a real neurodevelopmental condition. The ADHD Belief Score examines whether a belief has become attached to one repeated ADHD experience. It does not claim that belief causes ADHD or explains every ADHD difficulty.",
          },
        },
        {
          "@type": "Question",
          name: "Is this an ADHD diagnosis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The ADHD Belief Score does not determine whether you have ADHD. It is an educational and reflective tool. It does not provide diagnosis, medical care, treatment, psychotherapy, or crisis support.",
          },
        },
        {
          "@type": "Question",
          name: "Is technology deciding what is true about me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The technology helps organize patterns in the information you choose to provide. It does not independently know your history and does not define who you are. The result is a possible interpretation for you to examine; you remain the authority on what fits.",
          },
        },
        {
          "@type": "Question",
          name: "What if my ADHD Belief Score feels inaccurate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Treat it as a hypothesis. Keep what fits. Correct, refine, or reject what does not. The result is intended to support reflection, not replace your judgment.",
          },
        },
        {
          "@type": "Question",
          name: "What happens with the information I provide?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your answers are used to generate your personalized ADHD Belief Score. Selected team members may review limited information for quality assurance, safety, or support, according to the published Privacy Policy. Your information is not sold.",
          },
        },
        {
          "@type": "Question",
          name: "Is the complete ADHD Belief Score really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You receive your complete free ADHD Belief Score before any paid offer is presented. No credit card is required. Afterward, you may be offered an optional paid next step.",
          },
        },
      ],
    },
    {
      "@type": "VideoObject",
      "@id": `${SITE}/#vsl`,
      name: "AI Merge ADHD Belief Score introduction",
      description:
        "Manuj Aggarwal explains what the free ADHD Belief Score examines: what one repeated ADHD pattern may have taught you to believe about yourself.",
      contentUrl: `${SITE}/video/vsl-adhd-v1.mp4`,
      thumbnailUrl: `${SITE}/video/vsl-poster.jpg`,
      // TODO(launch): set to the real publish date of the final VSL cut.
      uploadDate: "2026-07-14",
      duration: "PT6M21S",
    },
    {
      "@type": "ScholarlyArticle",
      "@id": `${SITE}/#mensa`,
      name: "AI Merge belief update protocol",
      author: { "@id": `${SITE}/#manuj` },
      isPartOf: {
        "@type": "PublicationVolume",
        volumeNumber: "56",
        issueNumber: "2",
        datePublished: "2025",
        isPartOf: {
          "@type": "Periodical",
          name: "Mensa Research Journal",
        },
      },
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject; there is no user input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
