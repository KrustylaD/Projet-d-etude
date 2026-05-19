import React from "react";
import { COLORS } from "../design/tokens";

interface LetterboxProps {
  barHeight?: number;
  children: React.ReactNode;
}

export const Letterbox: React.FC<LetterboxProps> = ({
  barHeight = 140,
  children,
}) => {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: COLORS.Black,
          zIndex: 900,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: COLORS.Black,
          zIndex: 900,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: barHeight,
          left: 0,
          right: 0,
          bottom: barHeight,
        }}
      >
        {children}
      </div>
    </div>
  );
};
