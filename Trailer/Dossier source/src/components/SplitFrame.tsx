import React from "react";
import { COLORS } from "../design/tokens";

interface SplitPanel {
  content: React.ReactNode;
  col?: number;
  row?: number;
}

interface SplitFrameProps {
  panels: SplitPanel[];
  cols?: number;
  rows?: number;
  gap?: number;
  gapColor?: string;
  style?: React.CSSProperties;
}

export const SplitFrame: React.FC<SplitFrameProps> = ({
  panels,
  cols = 2,
  rows = 2,
  gap = 3,
  gapColor = COLORS.Lime,
  style,
}) => {
  const grid = panels.slice(0, cols * rows);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        backgroundColor: gapColor,
        ...style,
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: COLORS.Black,
            overflow: "hidden",
            position: "relative",
            ...(i < grid.length
              ? {}
              : { backgroundColor: "transparent" }),
          }}
        >
          {grid[i]?.content}
        </div>
      ))}
    </div>
  );
};
