import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { easeOutExpo } from "../animations/easings";

type KineticVariant = "cascade" | "spread" | "zoom";

interface KineticWordProps {
  text: string;
  variant?: KineticVariant;
  startFrame?: number;
  animationDuration?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
}

export const KineticWord: React.FC<KineticWordProps> = ({
  text,
  variant = "cascade",
  startFrame = 0,
  animationDuration = 8,
  color = COLORS.Cream,
  fontSize = 72,
  fontFamily = FONTS.title,
  fontWeight = 900,
  style,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const progress = interpolate(localFrame, [0, animationDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  const getStyle = (): React.CSSProperties => {
    switch (variant) {
      case "cascade":
        return {
          opacity: progress,
          transform: `translateY(${(1 - progress) * -24}px)`,
        };
      case "spread":
        return {
          opacity: progress,
          transform: `scaleX(${0.2 + progress * 0.8})`,
          transformOrigin: "center center",
        };
      case "zoom":
        return {
          opacity: progress,
          transform: `scale(${0.4 + progress * 0.6})`,
        };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily,
        fontWeight,
        fontSize,
        color,
        lineHeight: 1,
        ...style,
      }}
    >
      <span style={{ display: "inline-block", whiteSpace: "pre-wrap", ...getStyle() }}>
        {text}
      </span>
    </div>
  );
};
