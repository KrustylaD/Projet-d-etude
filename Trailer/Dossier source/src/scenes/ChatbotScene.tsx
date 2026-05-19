import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS } from "../design/tokens";
import { PhoneMockup, ChatBubble } from "../components/PhoneMockup";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";

interface MessageDef {
  text: string;
  isUser: boolean;
  appearAt: number;
}

const messages: MessageDef[] = [
  { text: " Bonjour ! Décrivez le problème", isUser: false, appearAt: 5 },
  { text: "Mes tomates ont des taches brunes sur les feuilles...", isUser: true, appearAt: 30 },
  { text: "Analyse en cours...", isUser: false, appearAt: 55 },
  { text: "🔍 Mildiou détecté à 97%", isUser: false, appearAt: 70 },
  { text: "Traitement: bouillie bordelaise recommandé", isUser: false, appearAt: 85 },
  { text: "Merci ! 🙏", isUser: true, appearAt: 98 },
];

export const ChatbotScene: React.FC = () => {
  const frame = useCurrentFrame();

  const entryOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${COLORS.Forest}22 0%, ${COLORS.Black} 100%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 60,
          top: 0,
          bottom: 0,
          width: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <DataRain density={15} speed={2} color={COLORS.Lime} opacity={0.1} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          opacity: entryOpacity,
          zIndex: 2,
        }}
      >
        <PhoneMockup frame={frame} startFrame={0}>
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              text={msg.text}
              isUser={msg.isUser}
              frame={frame}
              appearAt={msg.appearAt}
            />
          ))}
        </PhoneMockup>

        <KineticWord
          text="Diagnostiquez en conversant"
          variant="cascade"
          startFrame={55}
          fontSize={22}
          color={COLORS.Cream}
          fontWeight={700}
          style={{ letterSpacing: 2, textShadow: "0 4px 30px rgba(0,0,0,0.8)", opacity: 0.7 }}
        />
      </div>
    </AbsoluteFill>
  );
};
