import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../design/tokens";

export const NeuralNetwork: React.FC<{
  frame: number;
  layerCount?: number;
  nodesPerLayer?: number;
}> = ({ frame, layerCount = 4, nodesPerLayer = 5 }) => {
  const layers = useMemo(() => {
    return Array.from({ length: layerCount }, (_, l) =>
      Array.from({ length: nodesPerLayer - (l % 2) }, (_, n) => {
        const seed = l * 100 + n * 37;
        return {
          x: (l + 0.5) / layerCount,
          y: (n + 0.5) / (nodesPerLayer - (l % 2)),
          phase: seed,
        };
      })
    );
  }, [layerCount, nodesPerLayer]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      {layers.slice(0, -1).map((layer, l) =>
        layer.map((nodeA) =>
          layers[l + 1].map((nodeB) => {
            const pulse = Math.sin(frame * 0.02 + nodeA.phase * 0.1) * 0.5 + 0.5;
            return (
              <line
                key={`${l}-${nodeA.phase}-${nodeB.phase}`}
                x1={nodeA.x * 1920}
                y1={nodeA.y * 1080}
                x2={nodeB.x * 1920}
                y2={nodeB.y * 1080}
                stroke={COLORS.Lime}
                strokeWidth={0.5 + pulse * 1.5}
                opacity={0.1 + pulse * 0.3}
              />
            );
          })
        )
      )}
      {layers.map((layer, l) =>
        layer.map((node) => {
          const pulse = Math.sin(frame * 0.03 + node.phase * 0.15) * 0.5 + 0.5;
          return (
            <circle
              key={node.phase}
              cx={node.x * 1920}
              cy={node.y * 1080}
              r={6 + pulse * 4}
              fill={COLORS.Lime}
              opacity={0.4 + pulse * 0.6}
            />
          );
        })
      )}
    </svg>
  );
};
