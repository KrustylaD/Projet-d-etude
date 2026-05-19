import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../design/tokens";

interface ScanRevealProps {
  children: React.ReactNode;
  duration: number;
  direction?: "horizontal" | "vertical";
  color?: string;
}

export const ScanReveal: React.FC<ScanRevealProps> = ({
  children,
  duration,
  direction = "horizontal",
  color = COLORS.Lime,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const isHorizontal = direction === "horizontal";
  const scanPos = `${progress * 100}%`;
  const clipPath = isHorizontal
    ? `inset(0 ${100 - progress * 100}% 0 0)`
    : `inset(${100 - progress * 100}% 0 0 0)`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ clipPath, overflow: "hidden" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          [isHorizontal ? "right" : "bottom"]: 0,
          [isHorizontal ? "top" : "left"]: 0,
          [isHorizontal ? "width" : "height"]: 3,
          [isHorizontal ? "height" : "width"]: "100%",
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}, 0 0 60px ${color}`,
          opacity: progress < 1 ? 1 : 0,
          transition: "opacity 0.1s",
          [isHorizontal ? "left" : "top"]: isHorizontal ? 0 : scanPos,
        }}
      />
    </div>
  );
};
