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
        "A private ADHD coaching program for executives, founders, and operators with ADHD-style brains.",
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
