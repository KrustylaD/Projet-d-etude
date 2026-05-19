import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { BeatPulse } from "../components/BeatPulse";
import { CameraShake } from "../components/CameraShake";

export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();

  const scanProgress = interpolate(frame, [6, 25], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const showFlash = frame >= 5 && frame < 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      {/* FLASH: frame 5-6 — single-frame white flash */}
      {showFlash && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.Cream, zIndex: 100 }} />
      )}

      {/* Background: Matrix-style DataRain at low opacity */}
      <DataRain density={20} speed={0.8} opacity={0.12} />

      {/* Scan line: sweeps left-to-right from frame 6 to 25 */}
      <div
        style={{
          position: "absolute",
          left: scanProgress * 1920 - 2,
          top: 0,
          width: 4,
          height: "100%",
          backgroundColor: COLORS.Lime,
          boxShadow: `0 0 40px ${COLORS.Lime}, 0 0 100px ${COLORS.Lime}`,
          opacity: scanProgress < 1 ? 1 : 0,
        }}
      />

      {/* Central content: logo text + subtitle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* CameraShake wrapper for the logo assembly */}
        <CameraShake intensity={12} decay={12} frequency={2}>
          <KineticWord
            text="AgriScan.ai"
            variant="zoom"
            startFrame={6}
            fontSize={80}
            color={COLORS.Cream}
            fontWeight={900}
          />
        </CameraShake>

        {/* Subtitle — drops in as cascade from frame 22 */}
        <div style={{ marginTop: 10 }}>
          <KineticWord
            text="Diagnostic IA pour l'agriculture"
            variant="cascade"
            startFrame={22}
            fontSize={20}
            color={COLORS.Cream}
            fontWeight={400}
            style={{ letterSpacing: 4, textTransform: "uppercase", opacity: 0.6 }}
          />
        </div>
      </div>

      {/* BeatPulse dot: appears at frame 45, pulses at 100 BPM */}
      {frame >= 45 && (
        <div
          style={{
            position: "absolute",
            bottom: "40%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <BeatPulse bpm={100} amplitude={0.03} glow={false}>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: COLORS.Lime,
                boxShadow: `0 0 20px ${COLORS.Lime}`,
              }}
            />
          </BeatPulse>
        </div>
      )}
    </AbsoluteFill>
  );
};
