import React, { ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../design/tokens";

interface PhoneMockupProps {
  children: ReactNode;
  frame: number;
  startFrame?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  frame,
  startFrame = 0,
}) => {
  const localFrame = frame - startFrame;
  const enter = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: 320,
        height: 640,
        borderRadius: 40,
        border: `3px solid ${COLORS.Slate}`,
        backgroundColor: COLORS.Black,
        boxShadow: `0 0 40px ${COLORS.Lime}22, 0 0 80px ${COLORS.Lime}11, 0 20px 60px rgba(0,0,0,0.5)`,
        padding: 12,
        position: "relative",
        overflow: "hidden",
        transform: `translateY(${(1 - enter) * 80}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 120,
          height: 28,
          backgroundColor: COLORS.Black,
          borderRadius: 20,
          position: "absolute",
          top: 8,
          left: "50%",
          marginLeft: -60,
          zIndex: 10,
        }}
      />
      <div
        style={{
          backgroundColor: "#0A1B0E",
          borderRadius: 28,
          height: "100%",
          padding: "24px 12px 12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: COLORS.Lime,
            position: "absolute",
            top: 14,
            right: 20,
            boxShadow: `0 0 6px ${COLORS.Lime}`,
          }}
        />
        {children}
      </div>
    </div>
  );
};

export const ChatBubble: React.FC<{
  text: string;
  isUser?: boolean;
  frame: number;
  appearAt: number;
  delay?: number;
}> = ({ text, isUser = false, frame, appearAt, delay = 18 }) => {
  const localFrame = frame - appearAt;
  const progress = interpolate(localFrame, [0, delay], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 8,
        opacity: progress,
        transform: `scale(${1 + (1 - progress) * 0.1})`,
        transformOrigin: isUser ? "bottom right" : "bottom left",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "12px 16px",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          backgroundColor: isUser ? COLORS.Lime : COLORS.Slate,
          color: isUser ? COLORS.Black : COLORS.Cream,
          fontFamily: FONTS.body,
          fontSize: 14,
          lineHeight: 1.4,
          fontWeight: isUser ? 600 : 400,
        }}
      >
        {text}
      </div>
    </div>
  );
};
