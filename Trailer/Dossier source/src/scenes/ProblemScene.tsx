import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { SplitFrame } from "../components/SplitFrame";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { ParticleField } from "../components/ParticleField";

const wiltedPlantSvg = (i: number, frame: number) => {
  const droop = Math.sin(frame * 0.02 + i * 1.5) * 15 + 15;
  const rotate = Math.sin(i * 2 + frame * 0.01) * 8;
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid meet">
      <line x1="100" y1="280" x2="100" y2="100" stroke={COLORS.Slate} strokeWidth="4" />
      <path d={`M100 160 Q${80 - droop} 140, ${90 - droop} 110`} stroke="#6B4226" strokeWidth="3" fill="none" />
      <path d={`M100 160 Q${120 + droop} 140, ${110 + droop} 110`} stroke="#6B4226" strokeWidth="3" fill="none" />
      <ellipse cx="100" cy="90" rx="25" ry="15" fill="#4a3520" opacity="0.6" />
      <g transform={`rotate(${rotate}, 100, 100)`}>
        <line x1="100" y1="100" x2={80 - droop * 0.3} y2={60} stroke={COLORS.Slate} strokeWidth="2" />
        <line x1="100" y1="100" x2={120 + droop * 0.3} y2={55} stroke={COLORS.Slate} strokeWidth="2" />
      </g>
    </svg>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <ParticleField count={30} colors={["#ff3355", "#ff8844"]} speed={0.8} size={[2, 4]} />
      <DataRain density={20} speed={0.5} color="#ff3355" opacity={0.08} />

      <div style={{ position: "absolute", inset: 0 }}>
        <SplitFrame
          panels={[
            { content: wiltedPlantSvg(0, frame) },
            { content: wiltedPlantSvg(1, frame) },
            { content: wiltedPlantSvg(2, frame) },
          ]}
          cols={3}
          rows={1}
          gap={4}
          gapColor={COLORS.Black}
          style={{ opacity: interpolate(frame, [0, 25], [0, 0.4], { extrapolateRight: "clamp" }) }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${COLORS.Black} 100%)`,
          zIndex: 2,
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
          zIndex: 3,
          gap: 16,
          padding: 40,
        }}
      >
        <KineticWord
          text="LES MALADIES"
          variant="cascade"
          startFrame={20}
          
          fontSize={56}
          color={COLORS.Cream}
          fontWeight={900}
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)", letterSpacing: -1 }}
        />

        <KineticWord
          text="DÉTRUISENT"
          variant="spread"
          startFrame={32}
          
          fontSize={56}
          color={COLORS.Cream}
          fontWeight={900}
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)", letterSpacing: -1 }}
        />

        <div style={{ marginTop: 20 }}>
          <KineticWord
            text="30% des récoltes perdues chaque année"
            variant="spread"
            startFrame={48}
            
            fontSize={22}
            color="#ff3355"
            fontWeight={700}
            style={{ letterSpacing: 2, textShadow: "0 0 20px rgba(255,51,85,0.3)" }}
          />
        </div>
      </div>

    </AbsoluteFill>
  );
};
