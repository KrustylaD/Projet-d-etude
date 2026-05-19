import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { DashboardUI } from "../components/DashboardUI";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dashEnter = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 60,
        }}
      >
        <KineticWord
          text="Tableau de bord temps réel"
          variant="spread"
          startFrame={20}
          
          fontSize={28}
          color={COLORS.Cream}
          fontWeight={800}
          style={{ letterSpacing: -0.5 }}
        />

        <div
          style={{
            width: 1000,
            height: 450,
            transform: `scaleX(${0.3 + dashEnter * 0.7})`,
            opacity: dashEnter,
          }}
        >
          <DashboardUI frame={frame} startFrame={0} fps={fps} />
        </div>

        <KineticWord
          text="Suivez l'état de santé de vos parcelles"
          variant="cascade"
          startFrame={40}
          
          fontSize={18}
          color={COLORS.Cream}
          fontWeight={400}
          style={{ opacity: 0.6, letterSpacing: 2 }}
        />
      </div>

      <BeatPulse bpm={120} amplitude={0.03} glow={false}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      </BeatPulse>

    </AbsoluteFill>
  );
};
