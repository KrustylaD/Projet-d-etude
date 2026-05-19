import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";
import { StoreButtons } from "../components/StoreButtons";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.Black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <BeatPulse bpm={90} amplitude={0.03} glow color={COLORS.Lime}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke={COLORS.Lime} strokeWidth="2" />
          <path d="M32 8 C32 8 20 24 20 32 C20 40 26 48 32 48 C38 48 44 40 44 32 C44 24 32 8 32 8Z" fill={COLORS.Lime} opacity="0.2" />
          <circle cx="32" cy="32" r="4" fill={COLORS.Lime} />
        </svg>
      </BeatPulse>

      <KineticWord
        text="AgriScan.ai"
        variant="zoom"
        startFrame={5}
        
        fontSize={48}
        color={COLORS.Cream}
        fontWeight={900}
        style={{ letterSpacing: -2 }}
      />

      <KineticWord
        text="L'IA qui protège vos cultures"
        variant="cascade"
        startFrame={5}
        
        fontSize={18}
        color={COLORS.Lime}
        fontWeight={600}
        style={{ letterSpacing: 3, textTransform: "uppercase", opacity: 0.8 }}
      />

      <div style={{ marginTop: 8 }}>
        <StoreButtons frame={frame} startFrame={8} fps={fps} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          marginLeft: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: COLORS.Lime,
          opacity: interpolate(frame, [90, 110], [1, 0]),
          boxShadow: `0 0 20px ${COLORS.Lime}`,
        }}
      />
    </AbsoluteFill>
  );
};
