import { spring, SpringConfig } from "remotion";

export const fastSpring = (frame: number, fps: number, config?: Partial<SpringConfig>) =>
  spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 200,
      ...config,
    },
  });

export const softSpring = (frame: number, fps: number, config?: Partial<SpringConfig>) =>
  spring({
    frame,
    fps,
    config: {
      damping: 20,
      mass: 1,
      stiffness: 100,
      ...config,
    },
  });

export const bounceSpring = (frame: number, fps: number, config?: Partial<SpringConfig>) =>
  spring({
    frame,
    fps,
    config: {
      damping: 8,
      mass: 0.8,
      stiffness: 300,
      ...config,
    },
  });
