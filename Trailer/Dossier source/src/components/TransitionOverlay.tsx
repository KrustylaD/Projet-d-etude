import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../design/tokens";

type TransitionType = "glitch" | "dataMorph" | "flash" | "wipe";

interface TransitionOverlayProps {
  type: TransitionType;
  duration?: number;
  direction?: "horizontal" | "vertical";
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  type,
  duration = 10,
  direction = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (type === "glitch") {
    const shear = interpolate(progress, [0, 0.3, 0.7, 1], [0, 8, -8, 0]);
    const rgbOffset = interpolate(progress, [0, 0.5, 1], [0, 6, 0]);
    const opacity = interpolate(progress, [0.7, 1], [1, 0]);

    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${direction === "horizontal" ? "90deg" : "0deg"}, transparent ${progress * 100}%, ${COLORS.Lime}44 50%, transparent ${(1 - progress) * 100}%)`,
            opacity,
            transform: `skewX(${shear}deg)`,
          }}
        />
        {rgbOffset > 0 && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: COLORS.Cream,
                opacity: 0.03,
                transform: `translateX(${rgbOffset}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: COLORS.Lime,
                opacity: 0.02,
                transform: `translateX(${-rgbOffset}px)`,
              }}
            />
          </>
        )}
      </div>
    );
  }

  if (type === "flash") {
    const flash = interpolate(progress, [0, 0.05, 0.15], [0, 1, 0]);
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.Cream,
          opacity: flash,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    );
  }

  if (type === "dataMorph") {
    const cols = 40;
    const rows = 20;
    const chars = "01アイウエオカキクケコABCDEF<>/{}[]|&^%#";
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0]),
          pointerEvents: "none",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: cols * rows }, (_, i) => (
          <span
            key={i}
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              color: COLORS.Lime,
              opacity: Math.random() > progress ? 0.8 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chars[Math.floor(Math.random() * chars.length)]}
          </span>
        ))}
      </div>
    );
  }

  if (type === "wipe") {
    const wipePos = progress * 100;
    const isH = direction === "horizontal";
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
          background: `linear-gradient(${isH ? "90deg" : "0deg"}, ${COLORS.Black} ${wipePos}%, transparent ${wipePos}%)`,
        }}
      />
    );
  }

  return null;
};
