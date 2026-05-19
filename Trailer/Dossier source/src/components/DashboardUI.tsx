import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { easeOutExpo } from "../animations/easings";

interface DashboardMetric {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
}

const metrics: DashboardMetric[] = [
  { label: "Parcelles suivies", value: 234, color: COLORS.Lime },
  { label: "Alertes actives", value: 12, color: "#ff3355" },
  { label: "Diagnostics", value: 89, suffix: "%", color: "#4fc3f7" },
  { label: "Temps réponse", value: 2.4, suffix: "s", color: COLORS.Cream },
];

export const DashboardUI: React.FC<{
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
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {metrics.map((m, i) => {
          const appear = interpolate(localFrame - i * 8, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOutExpo,
          });
          const count = Math.round(interpolate(localFrame - i * 8, [10, 40], [0, m.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }));

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: COLORS.Black,
                borderRadius: 12,
                padding: "14px 16px",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 20}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 11,
                  color: COLORS.Cream,
                  opacity: 0.6,
                  marginBottom: 4,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: 700,
                  color: m.color || COLORS.Cream,
                }}
              >
                {count}
                {m.suffix || ""}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: COLORS.Black,
          borderRadius: 12,
          padding: 16,
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        {Array.from({ length: 24 }, (_, i) => {
          const barHeight = 30 + Math.sin(i * 0.8) * 25 + Math.sin(i * 0.3) * 15;
          const grow = interpolate(localFrame - 40, [0, 30], [0, barHeight], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOutExpo,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${grow}%`,
                backgroundColor: i % 3 === 1 ? COLORS.Lime : COLORS.Slate,
                borderRadius: "4px 4px 0 0",
                opacity: 0.5 + (i % 3 === 1 ? 0.5 : 0),
                minHeight: 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
