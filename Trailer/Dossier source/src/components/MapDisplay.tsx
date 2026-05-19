import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { COLORS, FONTS } from "../design/tokens";

interface MapPin {
  x: number;
  y: number;
  severity: "high" | "medium" | "low";
  label: string;
}

const pins: MapPin[] = [
  { x: 0.3, y: 0.4, severity: "high", label: "Mildiou" },
  { x: 0.55, y: 0.35, severity: "medium", label: "Rouille" },
  { x: 0.7, y: 0.6, severity: "high", label: "Oïdium" },
  { x: 0.4, y: 0.7, severity: "low", label: "Pucerons" },
  { x: 0.2, y: 0.55, severity: "medium", label: "Fusariose" },
];

export const MapDisplay: React.FC<{
  frame: number;
  startFrame: number;
  fps: number;
}> = ({ frame, startFrame, fps }) => {
  const localFrame = frame - startFrame;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A1B0E",
        borderRadius: 16,
        border: `1px solid ${COLORS.Slate}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(i / 8) * 100}%`,
            height: 1,
            backgroundColor: `${COLORS.Slate}44`,
          }}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${(i / 12) * 100}%`,
            width: 1,
            backgroundColor: `${COLORS.Slate}44`,
          }}
        />
      ))}

      {[0.2, 0.35, 0.5, 0.65, 0.8].map((y, i) => (
        <div
          key={`topo${i}`}
          style={{
            position: "absolute",
            left: `${10 + Math.sin(i * 1.5) * 5}%`,
            right: `${10 + Math.cos(i * 2) * 5}%`,
            top: `${y * 100}%`,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${COLORS.Lime}33, ${COLORS.Lime}55, ${COLORS.Lime}33, transparent)`,
            borderRadius: "50%",
          }}
        />
      ))}

      {pins.map((pin, i) => {
        const dropProgress = spring({
          frame: localFrame - i * 12 - 20,
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 200 },
        });

        if (localFrame < i * 12 + 20) return null;

        const pinColor =
          pin.severity === "high"
            ? "#ff3355"
            : pin.severity === "medium"
              ? COLORS.Lime
              : COLORS.Cream;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: `${pin.x * 100}%`,
                top: `${pin.y * 100}%`,
                width: 40,
                height: 40,
                marginLeft: -20,
                marginTop: -20,
                borderRadius: "50%",
                border: `2px solid ${pinColor}`,
                opacity: dropProgress * (0.5 + Math.sin(frame * 0.03 + i) * 0.3),
                transform: `scale(${1 + Math.sin(frame * 0.02 + i) * 0.3})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${pin.x * 100}%`,
                top: `${pin.y * 100}%`,
                width: 12,
                height: 12,
                marginLeft: -6,
                marginTop: -6 * dropProgress - 6 * (1 - dropProgress) + 60 * (1 - dropProgress),
                borderRadius: "50%",
                backgroundColor: pinColor,
                boxShadow: `0 0 12px ${pinColor}`,
                opacity: dropProgress,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${pin.x * 100 + 2}%`,
                top: `${pin.y * 100 + 1}%`,
                color: pinColor,
                fontFamily: FONTS.mono,
                fontSize: 10,
                opacity: dropProgress * 0.8,
                whiteSpace: "nowrap",
              }}
            >
              {pin.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
