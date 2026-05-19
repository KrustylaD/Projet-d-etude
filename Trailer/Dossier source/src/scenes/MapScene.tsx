import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { MapDisplay } from "../components/MapDisplay";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { CameraShake } from "../components/CameraShake";

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapEnter = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <DataRain density={15} speed={0.5} opacity={0.05} />

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
          text="Visualisation géographique"
          variant="cascade"
          startFrame={15}
          
          fontSize={28}
          color={COLORS.Cream}
          fontWeight={800}
          style={{ letterSpacing: -0.5 }}
        />

        <div
          style={{
            width: 900,
            height: 500,
            transform: `scale(${0.5 + mapEnter * 0.5}) rotate(${(1 - mapEnter) * -5}deg)`,
            opacity: mapEnter,
          }}
        >
          <CameraShake intensity={3} decay={10} frequency={8}>
            <MapDisplay frame={frame} startFrame={0} fps={fps} />
          </CameraShake>
        </div>

        <KineticWord
          text="Alertes en temps réel sur votre territoire"
          variant="cascade"
          startFrame={40}
          
          fontSize={18}
          color={COLORS.Cream}
          fontWeight={400}
          style={{ opacity: 0.6, letterSpacing: 2 }}
        />
      </div>

    </AbsoluteFill>
  );
};
