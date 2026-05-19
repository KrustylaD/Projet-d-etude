import type { TransitionTiming } from "@remotion/transitions";

export const cinematicTiming = (durationInFrames: number): TransitionTiming => ({
  getDurationInFrames: () => durationInFrames,
  getProgress: ({ frame }) => {
    if (frame <= 0) return 0;
    if (frame >= durationInFrames) return 1;
    const t = frame / durationInFrames;
    return 1 - Math.pow(1 - t, 2.5);
  },
});
