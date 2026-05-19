import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { CameraShake } from "./components/CameraShake";
import { Letterbox } from "./components/Letterbox";
import { DataRain } from "./components/DataRain";
import { ParticleField } from "./components/ParticleField";
import { COLORS } from "./design/tokens";
import { swishPan, rackFocus, speedRamp, glide } from "./transitions/cinematic";
import { cinematicTiming } from "./transitions/timing";
import { LogoScene } from "./scenes/LogoScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { StatsScene } from "./scenes/StatsScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { ChatbotScene } from "./scenes/ChatbotScene";
import { MapScene } from "./scenes/MapScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { ClimaxScene } from "./scenes/ClimaxScene";
import { CTAScene } from "./scenes/CTAScene";

const fastTiming = cinematicTiming(30);
const mediumTiming = cinematicTiming(35);
const smoothTiming = cinematicTiming(45);
const focusTiming = cinematicTiming(40);

const SlideWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Letterbox>{children}</Letterbox>
);

export const AgriScanTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.08 }}>
        <DataRain density={25} speed={0.6} />
        <ParticleField count={40} speed={0.4} size={[1, 4]} />
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={75}>
            <SlideWrap>
              <LogoScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={speedRamp()} timing={fastTiming} />

          <TransitionSeries.Sequence durationInFrames={112}>
            <SlideWrap>
              <ProblemScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={swishPan({ direction: "right" })} timing={mediumTiming} />

          <TransitionSeries.Sequence durationInFrames={112}>
            <SlideWrap>
              <StatsScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={glide({ direction: "right" })} timing={smoothTiming} />

          <TransitionSeries.Sequence durationInFrames={112}>
            <SlideWrap>
              <SolutionScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={swishPan({ direction: "left" })} timing={mediumTiming} />

          <TransitionSeries.Sequence durationInFrames={180}>
            <SlideWrap>
              <ChatbotScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={rackFocus()} timing={focusTiming} />

          <TransitionSeries.Sequence durationInFrames={112}>
            <SlideWrap>
              <MapScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={glide({ direction: "up" })} timing={smoothTiming} />

          <TransitionSeries.Sequence durationInFrames={112}>
            <SlideWrap>
              <DashboardScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={speedRamp()} timing={fastTiming} />

          <TransitionSeries.Sequence durationInFrames={170}>
            <CameraShake intensity={30} decay={60} frequency={3} rotation>
              <SlideWrap>
                <ClimaxScene />
              </SlideWrap>
            </CameraShake>
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={rackFocus()} timing={focusTiming} />

          <TransitionSeries.Sequence durationInFrames={150}>
            <SlideWrap>
              <CTAScene />
            </SlideWrap>
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
