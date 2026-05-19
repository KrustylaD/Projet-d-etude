import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../design/tokens";

interface GlitchTextProps {
  text: string;
  style?: React.CSSProperties;
  glitchIntensity?: number;
  color?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  style,
  glitchIntensity = 3,
  color = COLORS.Cream,
}) => {
  const frame = useCurrentFrame();
  const glitchActive = frame % 12 < 2;

  return (
    <div
      style={{
        position: "relative",
        fontFamily: FONTS.title,
        fontWeight: 900,
        color,
        ...style,
      }}
    >
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
      {glitchActive && (
        <>
          <span
            style={{
              position: "absolute",
              top: 0,
              left: glitchIntensity * (Math.sin(frame * 0.7) > 0 ? 1 : -1),
              color: COLORS.Lime,
              opacity: 0.7,
              clipPath: `inset(${30 + Math.sin(frame) * 20}% 0 ${40 + Math.cos(frame) * 20}% 0)`,
              zIndex: 1,
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: "absolute",
              top: 0,
              left: -glitchIntensity * (Math.sin(frame * 0.5) > 0 ? 1 : -1),
              color: "#ff0040",
              opacity: 0.5,
              clipPath: `inset(${50 + Math.cos(frame) * 15}% 0 ${20 + Math.sin(frame) * 15}% 0)`,
              zIndex: 1,
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};
