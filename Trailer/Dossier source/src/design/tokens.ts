import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

export const COLORS = {
  Forest: "#0A1B0E",
  Cream: "#F9F9F2",
  Lime: "#D4FF50",
  Slate: "#2D3A2F",
  Black: "#050D07",
} as const;

export const FONTS = {
  title: "Plus Jakarta Sans",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

export const DURATION = {
  total: 767,
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const TRANSITION = {
  overlap: 35,
} as const;

export const SCENE_TIMING = {
  logo: { from: 0, duration: 75 },
  problem: { from: 75, duration: 90 },
  stats: { from: 165, duration: 90 },
  solution: { from: 255, duration: 90 },
  chatbot: { from: 345, duration: 90 },
  map: { from: 435, duration: 90 },
  dashboard: { from: 525, duration: 90 },
  climax: { from: 615, duration: 150 },
  cta: { from: 765, duration: 75 },
} as const;

export { loadFont, loadInter, loadJetBrains };
