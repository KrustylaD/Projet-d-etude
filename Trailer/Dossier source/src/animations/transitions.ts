import { interpolate, useCurrentFrame } from "remotion";
import { easeInOutExpo } from "./easings";

export const useSlideIn = (duration: number, direction: "left" | "right" | "up" | "down" = "left") => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    easing: easeInOutExpo,
    extrapolateRight: "clamp",
  });

  const offsetX = direction === "left" ? -200 : direction === "right" ? 200 : 0;
  const offsetY = direction === "up" ? -200 : direction === "down" ? 200 : 0;

  return {
    opacity: interpolate(progress, [0, 0.3], [0, 1]),
    transform: `translate(${offsetX * (1 - progress)}px, ${offsetY * (1 - progress)}px)`,
  };
};

export const useFadeIn = (duration: number, delay = 0) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    easing: easeInOutExpo,
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return { opacity: progress };
};

export const useGlitch = (frame: number, frequency = 4) => {
  const glitchActive = frame % frequency === 0;
  if (!glitchActive) return { x: 0, opacity: 1 };
  return {
    x: (Math.sin(frame * 1.3) * 8) | 0,
    opacity: 0.92,
  };
};
