import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../design/tokens";

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: [number, number];
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 30,
  colors = [COLORS.Lime, "#ff0040", COLORS.Cream],
  speed = 1,
  size = [2, 6],
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 137.508;
      return {
        x: ((Math.sin(seed) + 1) / 2) * 1920,
        y: ((Math.cos(seed * 1.3) + 1) / 2) * 1080,
        size: size[0] + ((Math.sin(seed * 2.7) + 1) / 2) * (size[1] - size[0]),
        color: colors[i % colors.length],
        speedX: (Math.sin(seed * 0.7) - 0.5) * speed,
        speedY: (Math.cos(seed * 1.1) - 0.5) * speed,
        opacity: 0.3 + ((Math.sin(seed * 3.1) + 1) / 2) * 0.7,
        phase: seed * 100,
      };
    });
  }, [count, colors, speed, size]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const x = (p.x + frame * p.speedX * 2) % 1920;
        const y = (p.y + frame * p.speedY * 2) % 1080;
        const opacity = interpolate(
          Math.sin(frame * 0.02 + p.phase),
          [-1, 1],
          [p.opacity * 0.3, p.opacity]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
