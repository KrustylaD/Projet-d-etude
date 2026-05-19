import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface CameraShakeProps {
  children: React.ReactNode;
  intensity?: number;
  decay?: number;
  frequency?: number;
  rotation?: boolean;
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  children,
  intensity = 14,
  decay = 20,
  frequency = 3,
  rotation = false,
}) => {
  const frame = useCurrentFrame();

  const shakeFactor = interpolate(frame, [0, decay], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const shouldShake = frame % frequency < 2;
  const currentIntensity = intensity * shakeFactor;

  const x = shouldShake
    ? (Math.sin(frame * 7.3) * currentIntensity) | 0
    : 0;
  const y = shouldShake
    ? (Math.cos(frame * 5.1) * currentIntensity) | 0
    : 0;
  const r = rotation && shouldShake
    ? (Math.sin(frame * 4.7) * currentIntensity * 0.1) | 0
    : 0;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
      }}
    >
      {children}
    </div>
  );
};
