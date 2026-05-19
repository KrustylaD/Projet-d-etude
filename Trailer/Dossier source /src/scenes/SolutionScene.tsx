import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { NeuralNetwork } from "../components/NeuralNetwork";
import { KineticWord } from "../components/KineticWord";
import { PhoneMockup, ChatBubble } from "../components/PhoneMockup";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const networkScale = interpolate(frame, [0, 20], [0.3, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const phoneSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${networkScale})`,
          opacity: interpolate(frame, [0, 20], [0, 0.5]),
        }}
      >
        <NeuralNetwork frame={frame} layerCount={5} nodesPerLayer={6} />
      </div>

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
        <KineticWord
          text="AgriScan.ai"
          variant="zoom"
          startFrame={10}
          
          fontSize={72}
          color={COLORS.Cream}
          fontWeight={900}
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.8)", letterSpacing: -2 }}
        />

        <div
          style={{
            opacity: interpolate(frame - 30, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateX(${(1 - phoneSpring) * 300}px) rotate(${(1 - phoneSpring) * -10}deg)`,
          }}
        >
          <PhoneMockup frame={frame} startFrame={30}>
            <ChatBubble text="  Prêt à diagnostiquer ?" isUser={false} frame={frame} appearAt={35} />
            <ChatBubble text="🌱 Prenez une photo" isUser={true} frame={frame} appearAt={50} />
          </PhoneMockup>
        </div>

        <KineticWord
          text="L'IA au service des agriculteurs"
          variant="cascade"
          startFrame={48}
          
          fontSize={24}
          color={COLORS.Lime}
          fontWeight={600}
          style={{ textShadow: `0 0 30px ${COLORS.Lime}44` }}
        />
      </div>

    </AbsoluteFill>
  );
};
