import type { MetadataRoute } from "next";

// Web app manifest, served at /manifest.webmanifest. Not a ranking factor, but
// it gives mobile "Add to Home Screen" a proper name/icon/theme and rounds out
// the site's technical polish. theme_color matches the viewport themeColor in
// app/layout.tsx (deep marine navy).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Free ADHD Belief Score · AI Merge",
    short_name: "ADHD Belief Score",
    description:
      "Get your free, personalized ADHD Belief Score. No credit card. Not a diagnosis.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a232e",
    theme_color: "#0a232e",
    icons: [
      {
        src: "/icon/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
