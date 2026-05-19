import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { SplitFrame } from "../components/SplitFrame";
import { KineticWord } from "../components/KineticWord";
import { ParticleField } from "../components/ParticleField";
export const ClimaxScene: React.FC = () => {
  const frame = useCurrentFrame();

  const burst = interpolate(frame - 50, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <SplitFrame
        cols={2}
        rows={2}
        gap={3}
        gapColor={`${COLORS.Lime}44`}
        panels={[
          { content: <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, #0A1B0E, #050D07)" }} /> },
          { content: <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, #0A1B0E, #050D07)" }} /> },
          { content: <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, #0A1B0E, #050D07)" }} /> },
          { content: <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, #0A1B0E, #050D07)" }} /> },
        ]}
        style={{ opacity: interpolate(frame, [0, 15], [0, 0.6]) }}
      />

      <div
        style={{
          position: "absolute",
          width: 2000,
          height: 2000,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.Lime}22 0%, transparent 70%)`,
          opacity: burst * 0.6,
          transform: `scale(${burst * 0.5 + 0.5})`,
          left: "50%",
          top: "50%",
          marginLeft: -1000,
          marginTop: -1000,
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
            gap: 8,
            zIndex: 5,
          }}
        >
          <KineticWord
            text="PROTÉGEZ"
            variant="zoom"
            startFrame={15}
            
            fontSize={78}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
          />
          <KineticWord
            text="VOS RÉCOLTES"
            variant="spread"
            startFrame={28}
            
            fontSize={78}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
          />
          <div style={{ height: 8 }} />
          <KineticWord
            text="NOURRISSEZ"
            variant="cascade"
            startFrame={42}
            
            fontSize={78}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
          <KineticWord
            text="LE MONDE"
            variant="zoom"
            startFrame={55}
            
            fontSize={78}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
        </div>

      {frame > 30 && (
        <ParticleField
          count={50}
          colors={[COLORS.Lime, COLORS.Cream, "#ff3355"]}
          speed={2}
          size={[3, 8]}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: COLORS.Lime,
          opacity: interpolate(frame - 130, [0, 20], [0, 1]),
          boxShadow: `0 0 30px ${COLORS.Lime}`,
        }}
      />
    </AbsoluteFill>
  );
};
