import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../design/tokens";

interface BeatPulseProps {
  children: React.ReactNode;
  bpm?: number;
  amplitude?: number;
  glow?: boolean;
  color?: string;
}

export const BeatPulse: React.FC<BeatPulseProps> = ({
  children,
  bpm = 120,
  amplitude = 0.04,
  glow = true,
  color = COLORS.Lime,
}) => {
  const frame = useCurrentFrame();
  const beatInterval = (60 / bpm) * 30;
  const beatPhase = (frame % beatInterval) / beatInterval;
  const pulse = beatPhase < 0.3
    ? 1 + Math.sin((beatPhase / 0.3) * Math.PI) * amplitude
    : 1;

  return (
    <div
      style={{
        transform: `scale(${pulse})`,
        filter: glow && pulse > 1 ? `drop-shadow(0 0 ${(pulse - 1) * 80}px ${color})` : undefined,
        transition: "filter 0.05s",
      }}
    >
      {children}
    </div>
  );
};
