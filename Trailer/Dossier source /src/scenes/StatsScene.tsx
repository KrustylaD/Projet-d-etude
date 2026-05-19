import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";
import { DataRain } from "../components/DataRain";
import { ParticleField } from "../components/ParticleField";

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <DataRain density={20} speed={0.6} opacity={0.06} />
      <ParticleField count={20} colors={[COLORS.Lime]} speed={0.3} size={[1, 3]} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <KineticWord
            text="1.3 MILLIARD"
            variant="cascade"
            startFrame={5}
            
            fontSize={96}
            color="#ff3355"
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 0 40px rgba(255,51,85,0.3)" }}
          />
          <KineticWord
            text="de tonnes de nourriture gaspillées par an"
            variant="cascade"
            startFrame={20}
            
            fontSize={22}
            color={COLORS.Cream}
            fontWeight={400}
            style={{ opacity: 0.6, marginTop: 8 }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <KineticWord
            text="200 M€"
            variant="spread"
            startFrame={30}
            
            fontSize={96}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
          <KineticWord
            text="de pertes économiques en Europe"
            variant="cascade"
            startFrame={45}
            
            fontSize={22}
            color={COLORS.Cream}
            fontWeight={400}
            style={{ opacity: 0.6, marginTop: 8 }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <KineticWord
            text="800 M"
            variant="zoom"
            startFrame={55}
            
            fontSize={96}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3 }}
          />
          <KineticWord
            text="d'agriculteurs touchés dans le monde"
            variant="cascade"
            startFrame={65}
            
            fontSize={22}
            color={COLORS.Cream}
            fontWeight={400}
            style={{ opacity: 0.6, marginTop: 8 }}
          />
        </div>
      </div>

      {frame >= 75 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <BeatPulse bpm={120} amplitude={0.06} glow color={COLORS.Lime}>
            <div style={{ width: "100%", height: "100%" }} />
          </BeatPulse>
        </div>
      )}

    </AbsoluteFill>
  );
};
