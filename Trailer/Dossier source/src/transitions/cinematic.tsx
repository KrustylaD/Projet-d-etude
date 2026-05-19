import React, { useMemo } from "react";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { COLORS } from "../design/tokens";

type Direction = "left" | "right" | "up" | "down";

type SwishPanProps = { direction?: Direction };
type RackFocusProps = Record<string, never>;
type SpeedRampProps = Record<string, never>;
type GlideProps = { direction?: Direction };

function dirToTranslate(dir: Direction, dist: number) {
  switch (dir) {
    case "left": return [ -dist, 0 ];
    case "right": return [ dist, 0 ];
    case "up": return [ 0, -dist ];
    case "down": return [ 0, dist ];
  }
}

function dirToAngle(dir: Direction) {
  switch (dir) {
    case "left": return 180;
    case "right": return 0;
    case "up": return -90;
    case "down": return 90;
  }
}

const SwishPanPresentation: React.FC<TransitionPresentationComponentProps<SwishPanProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const style = useMemo(() => {
    const dir = passedProps.direction ?? "right";
    const p = presentationProgress;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeIn = (t: number) => t * t * t;

    if (presentationDirection === "exiting") {
      const progress = easeIn(p);
      const [ dx, dy ] = dirToTranslate(dir, progress * 500);
      const vel = p < 0.3 ? p / 0.3 : (1 - (p - 0.3) / 0.7);
      const [ rx, ry ] = dirToTranslate(dir, vel * 6);
      return {
        transform: `translate(${dx}px, ${dy}px) scale(${1 - progress * 0.12}) translate(${rx}px, ${ry}px)`,
        filter: `blur(${vel * 14}px) brightness(${1 - progress * 0.4})`,
        opacity: 1 - progress,
      };
    }
    const progress = 1 - easeOut(1 - p);
    const [ dx, dy ] = dirToTranslate(dir, (progress - 1) * 420);
    const vel = 1 - progress;
    const [ rx, ry ] = dirToTranslate(dir, vel * 6);
    return {
      transform: `translate(${dx}px, ${dy}px) scale(${0.88 + progress * 0.12}) translate(${rx}px, ${ry}px)`,
      filter: `blur(${vel * 12}px) brightness(${0.6 + progress * 0.4})`,
      opacity: progress,
    };
  }, [presentationDirection, presentationProgress, passedProps]);

  return <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>;
};

const RackFocusPresentation: React.FC<TransitionPresentationComponentProps<RackFocusProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const style = useMemo(() => {
    const p = presentationProgress;
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const easeOutQuad = (t: number) => t * (2 - t);
    const easeInQuad = (t: number) => t * t;

    if (presentationDirection === "exiting") {
      const progress = smooth(p);
      const blurAmount = easeInQuad(progress) * 18;
      return {
        transform: `scale(${1 + progress * 0.02})`,
        filter: `blur(${blurAmount}px) saturate(${1 - progress * 0.5})`,
        opacity: 1 - easeOutQuad(progress),
      };
    }
    const progress = smooth(p);
    const blurAmount = easeOutQuad(1 - progress) * 18;
    return {
      transform: `scale(${1.02 - progress * 0.02})`,
      filter: `blur(${blurAmount}px) saturate(${0.5 + progress * 0.5})`,
      opacity: easeInQuad(progress),
    };
  }, [presentationDirection, presentationProgress]);

  return <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>;
};

const SpeedRampPresentation: React.FC<TransitionPresentationComponentProps<SpeedRampProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const style = useMemo(() => {
    const p = presentationProgress;
    const easeInCubic = (t: number) => t * t * t;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    if (presentationDirection === "exiting") {
      const progress = easeInCubic(p);
      const vel = p * 2;
      return {
        transform: `scale(${1 + progress * 0.5})`,
        filter: `brightness(${1 + progress * 8}) blur(${vel * 10}px)`,
        opacity: 1 - easeOutCubic(progress),
      };
    }
    const progress = easeOutCubic(p);
    const vel = (1 - p) * 2;
    return {
      transform: `scale(${1.5 - progress * 0.5})`,
      filter: `brightness(${1 + (1 - progress) * 6}) blur(${vel * 10}px)`,
      opacity: easeInCubic(progress),
    };
  }, [presentationDirection, presentationProgress]);

  return <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>;
};

const GlidePresentation: React.FC<TransitionPresentationComponentProps<GlideProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const style = useMemo(() => {
    const dir = passedProps.direction ?? "right";
    const p = presentationProgress;
    const easeInOutQuint = (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

    if (presentationDirection === "exiting") {
      const progress = easeInOutQuint(p);
      const [ dx, dy ] = dirToTranslate(dir, progress * 600);
      const depth = 1 - progress * 0.08;
      return {
        transform: `translate(${dx * 0.3}px, ${dy}px) scale(${depth})`,
        filter: `brightness(${1 - progress * 0.15})`,
        opacity: 1 - progress * progress,
      };
    }
    const progress = easeInOutQuint(p);
    const [ dx, dy ] = dirToTranslate(dir, (progress - 1) * 600);
    const depth = 0.92 + progress * 0.08;
    return {
      transform: `translate(${dx * 0.3}px, ${dy}px) scale(${depth})`,
      filter: `brightness(${0.85 + progress * 0.15})`,
      opacity: progress * progress,
    };
  }, [presentationDirection, presentationProgress, passedProps]);

  return <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>;
};

const VignettePresentation: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
}) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)`,
          zIndex: 10,
        }}
      />
    </div>
  );
};

export const swishPan = (props?: SwishPanProps): TransitionPresentation<SwishPanProps> => ({
  component: SwishPanPresentation,
  props: props ?? {},
});

export const rackFocus = (props?: RackFocusProps): TransitionPresentation<RackFocusProps> => ({
  component: RackFocusPresentation,
  props: props ?? {},
});

export const speedRamp = (props?: SpeedRampProps): TransitionPresentation<SpeedRampProps> => ({
  component: SpeedRampPresentation,
  props: props ?? {},
});

export const glide = (props?: GlideProps): TransitionPresentation<GlideProps> => ({
  component: GlidePresentation,
  props: props ?? {},
});

export const vignette = (): TransitionPresentation<Record<string, never>> => ({
  component: VignettePresentation,
  props: {},
});
