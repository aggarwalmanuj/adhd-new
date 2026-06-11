// 6 brand color pairs × 2 orientations = 12 palettes.
// The CSS tokens live in app/globals.css under [data-palette="<id>"].
export type Palette = {
  id: string;
  label: string;
  bg: string;
  accent: string;
  scheme: "light" | "dark";
};

export const PALETTES: Palette[] = [
  { id: "big-stone", label: "Big Stone · Bright Sun", bg: "#141D38", accent: "#FCDB32", scheme: "dark" },
  { id: "bright-sun", label: "Bright Sun · Big Stone", bg: "#FCDB32", accent: "#141D38", scheme: "light" },
  { id: "royal-blue", label: "Royal Blue · Powder Pink", bg: "#3447AA", accent: "#FBEAEB", scheme: "dark" },
  { id: "powder-pink", label: "Powder Pink · Royal Blue", bg: "#FBEAEB", accent: "#3447AA", scheme: "light" },
  { id: "deep-fir", label: "Deep Fir · Sulu", bg: "#163300", accent: "#9FE870", scheme: "dark" },
  { id: "sulu", label: "Sulu · Deep Fir", bg: "#9FE870", accent: "#163300", scheme: "light" },
  { id: "blue-whale", label: "Blue Whale · Jet Stream", bg: "#03363D", accent: "#BDD9D7", scheme: "dark" },
  { id: "jet-stream", label: "Jet Stream · Blue Whale", bg: "#BDD9D7", accent: "#03363D", scheme: "light" },
  { id: "black", label: "Black · Turquoise", bg: "#000000", accent: "#34E0A1", scheme: "dark" },
  { id: "turquoise", label: "Turquoise · Black", bg: "#34E0A1", accent: "#000000", scheme: "light" },
  { id: "periwinkle", label: "Periwinkle · Lavender", bg: "#6260FF", accent: "#E4E4FF", scheme: "dark" },
  { id: "lavender", label: "Lavender · Periwinkle", bg: "#E4E4FF", accent: "#6260FF", scheme: "light" },
];

export const DEFAULT_DARK = "big-stone";
export const DEFAULT_LIGHT = "lavender";
export const PALETTE_STORAGE_KEY = "hf-palette";
