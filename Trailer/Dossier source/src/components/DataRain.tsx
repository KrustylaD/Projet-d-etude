import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../design/tokens";

interface DataRainProps {
  density?: number;
  speed?: number;
  color?: string;
  opacity?: number;
  columns?: number;
}

export const DataRain: React.FC<DataRainProps> = ({
  density = 25,
  speed = 1,
  color = COLORS.Lime,
  opacity = 0.15,
  columns,
}) => {
  const frame = useCurrentFrame();
  const colCount = columns || density;
  const chars = "01アイウエオカキクケコ<>/{}[]|&^%#ABCDEF";

  const colData = useMemo(() => {
    return Array.from({ length: colCount }, (_, i) => ({
      x: ((i + 0.5) / colCount) * 1920,
      length: 5 + (i * 7) % 15,
      speed: speed * (0.5 + ((i * 3) % 10) / 10),
      seed: i * 137.5,
    }));
  }, [colCount, speed]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
      }}
    >
      {colData.map((col) => {
        const offset = (frame * col.speed + col.seed) % 150;
        return (
          <div
            key={col.seed}
            style={{
              position: "absolute",
              left: col.x,
              top: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${-50 + offset}px)`,
            }}
          >
            {Array.from({ length: col.length }, (_, j) => (
              <span
                key={j}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: j === 0 ? COLORS.Cream : color,
                  opacity: j === 0 ? 1 : 1 - j / col.length,
                  lineHeight: 1.1,
                }}
              >
                {chars[(Math.floor(frame * col.speed * 3 + col.seed + j * 7)) % chars.length]}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
