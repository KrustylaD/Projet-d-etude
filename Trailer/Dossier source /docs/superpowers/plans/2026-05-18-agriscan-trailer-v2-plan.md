# AgriScan Trailer v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the AgriScan.ai Remotion trailer with aggressive camera moves, kinetic typography, beat-synced animations, and hard transitions for a true cinematic trailer feel.

**Architecture:** 6 new toolkit components (CameraShake, KineticWord, TransitionOverlay, DataRain, BeatPulse, SplitFrame) + 9 rewritten scenes + updated orchestration. Each component is a focused React component using Remotion hooks. Existing components (PhoneMockup, NeuralNetwork, DashboardUI, MapDisplay, StoreButtons, ParticleField, GlitchText, ScanReveal) are reused.

**Tech Stack:** Remotion 4.0, React 18, TypeScript, Google Fonts (Plus Jakarta Sans, Inter, JetBrains Mono)

**Spec:** `docs/superpowers/specs/2026-05-18-agriscan-trailer-v2-design.md`

---

### Task 1: Update tokens.ts with new timing (840f)

**Files:**
- Modify: `src/design/tokens.ts`

- [ ] **Step 1: Update DURATION and SCENE_TIMING**

Replace the content with the new 840f timing:

```typescript
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

export const COLORS = {
  Forest: "#0A1B0E",
  Cream: "#F9F9F2",
  Lime: "#D4FF50",
  Slate: "#2D3A2F",
  Black: "#050D07",
} as const;

export const FONTS = {
  title: "Plus Jakarta Sans",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

export const DURATION = {
  total: 840,
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const SCENE_TIMING = {
  logo: { from: 0, duration: 75 },
  problem: { from: 75, duration: 90 },
  stats: { from: 165, duration: 90 },
  solution: { from: 255, duration: 90 },
  chatbot: { from: 345, duration: 90 },
  map: { from: 435, duration: 90 },
  dashboard: { from: 525, duration: 90 },
  climax: { from: 615, duration: 150 },
  cta: { from: 765, duration: 75 },
} as const;

export { loadFont, loadInter, loadJetBrains };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/design/tokens.ts
git commit -m "v2(tokens): update timing to 840f for trailer redesign"
```

---

### Task 2: CameraShake component

**Files:**
- Create: `src/components/CameraShake.tsx`

- [ ] **Step 1: Write CameraShake component**

```typescript
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface CameraShakeProps {
  children: React.ReactNode;
  intensity?: number;
  decay?: number;
  frequency?: number;
  rotation?: boolean;
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  children,
  intensity = 8,
  decay = 20,
  frequency = 3,
  rotation = false,
}) => {
  const frame = useCurrentFrame();

  const shakeFactor = interpolate(frame, [0, decay], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const shouldShake = frame % frequency < 2;
  const currentIntensity = intensity * shakeFactor;

  const x = shouldShake
    ? (Math.sin(frame * 7.3) * currentIntensity) | 0
    : 0;
  const y = shouldShake
    ? (Math.cos(frame * 5.1) * currentIntensity) | 0
    : 0;
  const r = rotation && shouldShake
    ? (Math.sin(frame * 4.7) * currentIntensity * 0.1) | 0
    : 0;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CameraShake.tsx
git commit -m "v2(component): add CameraShake wrapper"
```

---

### Task 3: KineticWord component

**Files:**
- Create: `src/components/KineticWord.tsx`

- [ ] **Step 1: Write KineticWord component**

```typescript
import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { easeOutExpo, easeOutBack } from "../animations/easings";

type KineticVariant = "explode" | "drop" | "zoom" | "cascade" | "spread";

interface KineticWordProps {
  text: string;
  variant?: KineticVariant;
  startFrame?: number;
  letterDelay?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
}

export const KineticWord: React.FC<KineticWordProps> = ({
  text,
  variant = "explode",
  startFrame = 0,
  letterDelay = 2,
  color = COLORS.Cream,
  fontSize = 72,
  fontFamily = FONTS.title,
  fontWeight = 900,
  style,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const letters = useMemo(() => text.split(""), [text]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        fontFamily,
        fontWeight,
        fontSize,
        color,
        lineHeight: 1,
        ...style,
      }}
    >
      {letters.map((letter, i) => {
        const charFrame = localFrame - i * letterDelay;
        if (charFrame < 0) {
          return <span key={i}>{letter === " " ? "\u00A0" : letter}</span>;
        }

        const progress = interpolate(charFrame, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: variant === "drop" ? easeOutBack : easeOutExpo,
        });

        const getTransform = () => {
          const seed = i * 37 + 13;
          switch (variant) {
            case "explode": {
              const angle = seed * 0.1;
              const dist = (1 - progress) * 200;
              return `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${0.3 + progress * 0.7}) rotate(${(1 - progress) * 30}deg)`;
            }
            case "drop":
              return `translateY(${(1 - progress) * -120}px) scale(${0.5 + progress * 0.5})`;
            case "zoom":
              return `scale(${1 + (1 - progress) * 2})`;
            case "cascade":
              return `translateY(${(1 - progress) * -60}px)`;
            case "spread": {
              const dir = i % 2 === 0 ? -1 : 1;
              return `translateX(${dir * (1 - progress) * 100}px)`;
            }
            default:
              return "none";
          }
        };

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: progress,
              transform: getTransform(),
              whiteSpace: letter === " " ? "pre" : undefined,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/KineticWord.tsx
git commit -m "v2(component): add KineticWord component with 5 animation variants"
```

---

### Task 4: TransitionOverlay component

**Files:**
- Create: `src/components/TransitionOverlay.tsx`

- [ ] **Step 1: Write TransitionOverlay component**

```typescript
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../design/tokens";

type TransitionType = "glitch" | "dataMorph" | "flash" | "wipe";

interface TransitionOverlayProps {
  type: TransitionType;
  duration?: number;
  direction?: "horizontal" | "vertical";
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  type,
  duration = 10,
  direction = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (type === "glitch") {
    const shear = interpolate(progress, [0, 0.3, 0.7, 1], [0, 8, -8, 0]);
    const rgbOffset = interpolate(progress, [0, 0.5, 1], [0, 6, 0]);
    const opacity = interpolate(progress, [0.7, 1], [1, 0]);

    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${direction === "horizontal" ? "90deg" : "0deg"}, transparent ${progress * 100}%, ${COLORS.Lime}44 50%, transparent ${(1 - progress) * 100}%)`,
            opacity,
            transform: `skewX(${shear}deg)`,
          }}
        />
        {rgbOffset > 0 && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: COLORS.Cream,
                opacity: 0.03,
                transform: `translateX(${rgbOffset}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: COLORS.Lime,
                opacity: 0.02,
                transform: `translateX(${-rgbOffset}px)`,
              }}
            />
          </>
        )}
      </div>
    );
  }

  if (type === "flash") {
    const flash = interpolate(progress, [0, 0.1, 0.3], [0, 1, 0]);
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.Cream,
          opacity: flash * 0.8,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    );
  }

  if (type === "dataMorph") {
    const cols = 40;
    const rows = 20;
    const chars = "01アイウエオカキクケコABCDEF<>/{}[]|&^%#";
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0]),
          pointerEvents: "none",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: cols * rows }, (_, i) => (
          <span
            key={i}
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              color: COLORS.Lime,
              opacity: Math.random() > progress ? 0.8 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chars[Math.floor(Math.random() * chars.length)]}
          </span>
        ))}
      </div>
    );
  }

  if (type === "wipe") {
    const wipePos = progress * 100;
    const isH = direction === "horizontal";
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
          background: `linear-gradient(${isH ? "90deg" : "0deg"}, ${COLORS.Black} ${wipePos}%, transparent ${wipePos}%)`,
        }}
      />
    );
  }

  return null;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/TransitionOverlay.tsx
git commit -m "v2(component): add TransitionOverlay with glitch/flash/dataMorph/wipe"
```

---

### Task 5: DataRain component

**Files:**
- Create: `src/components/DataRain.tsx`

- [ ] **Step 1: Write DataRain component**

```typescript
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../design/tokens";

interface DataRainProps {
  density?: number;
  speed?: number;
  color?: string;
  opacity?: number;
  columns?: number;
}

export const DataRain: React.FC<DataRainProps> = ({
  density = 25,
  speed = 1,
  color = COLORS.Lime,
  opacity = 0.15,
  columns,
}) => {
  const frame = useCurrentFrame();
  const colCount = columns || density;
  const chars = "01アイウエオカキクケコ<>/{}[]|&^%#ABCDEF";

  const colData = useMemo(() => {
    return Array.from({ length: colCount }, (_, i) => ({
      x: ((i + 0.5) / colCount) * 1920,
      length: 5 + (i * 7) % 15,
      speed: speed * (0.5 + ((i * 3) % 10) / 10),
      seed: i * 137.5,
    }));
  }, [colCount, speed]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
      }}
    >
      {colData.map((col) => {
        const offset = (frame * col.speed + col.seed) % 150;
        return (
          <div
            key={col.seed}
            style={{
              position: "absolute",
              left: col.x,
              top: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${-50 + offset}px)`,
            }}
          >
            {Array.from({ length: col.length }, (_, j) => (
              <span
                key={j}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: j === 0 ? COLORS.Cream : color,
                  opacity: j === 0 ? 1 : 1 - j / col.length,
                  lineHeight: 1.1,
                }}
              >
                {chars[(Math.floor(frame * col.speed * 3 + col.seed + j * 7)) % chars.length]}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/DataRain.tsx
git commit -m "v2(component): add DataRain Matrix-style background"
```

---

### Task 6: BeatPulse component

**Files:**
- Create: `src/components/BeatPulse.tsx`

- [ ] **Step 1: Write BeatPulse component**

```typescript
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../design/tokens";

interface BeatPulseProps {
  children: React.ReactNode;
  bpm?: number;
  amplitude?: number;
  glow?: boolean;
  color?: string;
}

export const BeatPulse: React.FC<BeatPulseProps> = ({
  children,
  bpm = 120,
  amplitude = 0.04,
  glow = true,
  color = COLORS.Lime,
}) => {
  const frame = useCurrentFrame();
  const beatInterval = (60 / bpm) * 30;
  const beatPhase = (frame % beatInterval) / beatInterval;
  const pulse = beatPhase < 0.3
    ? 1 + Math.sin((beatPhase / 0.3) * Math.PI) * amplitude
    : 1;

  return (
    <div
      style={{
        transform: `scale(${pulse})`,
        filter: glow && pulse > 1 ? `drop-shadow(0 0 ${(pulse - 1) * 80}px ${color})` : undefined,
        transition: "filter 0.05s",
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/BeatPulse.tsx
git commit -m "v2(component): add BeatPulse BPM-synced wrapper"
```

---

### Task 7: SplitFrame component

**Files:**
- Create: `src/components/SplitFrame.tsx`

- [ ] **Step 1: Write SplitFrame component**

```typescript
import React from "react";
import { COLORS } from "../design/tokens";

interface SplitPanel {
  content: React.ReactNode;
  col?: number;
  row?: number;
}

interface SplitFrameProps {
  panels: SplitPanel[];
  cols?: number;
  rows?: number;
  gap?: number;
  gapColor?: string;
  style?: React.CSSProperties;
}

export const SplitFrame: React.FC<SplitFrameProps> = ({
  panels,
  cols = 2,
  rows = 2,
  gap = 3,
  gapColor = COLORS.Lime,
  style,
}) => {
  const grid = panels.slice(0, cols * rows);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        backgroundColor: gapColor,
        ...style,
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: COLORS.Black,
            overflow: "hidden",
            position: "relative",
            ...(i < grid.length
              ? {}
              : { backgroundColor: "transparent" }),
          }}
        >
          {grid[i]?.content}
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/SplitFrame.tsx
git commit -m "v2(component): add SplitFrame multi-viewport layout"
```

---

### Task 8: LogoScene rewrite

**Files:**
- Rewrite: `src/scenes/LogoScene.tsx`

**Context:** This is the 2.5s opening. Flash -> scan line + DataRain -> KineticWord letters assemble -> subtitle drops -> BeatPulse -> transition glitch.

- [ ] **Step 1: Rewrite LogoScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { BeatPulse } from "../components/BeatPulse";
import { CameraShake } from "../components/CameraShake";
import { TransitionOverlay } from "../components/TransitionOverlay";

export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();

  const scanProgress = interpolate(frame, [6, 25], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const showFlash = frame >= 5 && frame < 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      {showFlash && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.Cream, zIndex: 100 }} />
      )}

      <DataRain density={20} speed={0.8} opacity={0.12} />

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
        <CameraShake intensity={4} decay={15} frequency={3}>
          <KineticWord
            text="AgriScan.ai"
            variant="explode"
            startFrame={6}
            letterDelay={2}
            fontSize={80}
            color={COLORS.Cream}
            fontWeight={900}
          />
        </CameraShake>

        <div style={{ marginTop: 10 }}>
          <KineticWord
            text="Diagnostic IA pour l'agriculture"
            variant="drop"
            startFrame={25}
            letterDelay={3}
            fontSize={20}
            color={COLORS.Cream}
            fontWeight={400}
            style={{ letterSpacing: 4, textTransform: "uppercase", opacity: 0.6 }}
          />
        </div>
      </div>

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

      {frame >= 65 && (
        <TransitionOverlay type="glitch" duration={10} direction="horizontal" />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/LogoScene.tsx
git commit -m "v2(scene): rewrite LogoScene with flash/scan/kinetic"
```

---

### Task 9: ProblemScene rewrite

**Files:**
- Rewrite: `src/scenes/ProblemScene.tsx`

**Context:** 3s scene. Split screen wilted plants -> "LES MALADIES" drop -> "DÉTRUISENT" spread -> "30%" kinetic -> DataRain intensifies -> data morph transition.

- [ ] **Step 1: Rewrite ProblemScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { SplitFrame } from "../components/SplitFrame";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { CameraShake } from "../components/CameraShake";
import { ParticleField } from "../components/ParticleField";
import { TransitionOverlay } from "../components/TransitionOverlay";

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
        <CameraShake intensity={10} decay={15} frequency={3}>
          <KineticWord
            text="LES MALADIES"
            variant="drop"
            startFrame={25}
            letterDelay={3}
            fontSize={56}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)", letterSpacing: -1 }}
          />
        </CameraShake>

        <CameraShake intensity={8} decay={12} frequency={3}>
          <KineticWord
            text="DÉTRUISENT"
            variant="spread"
            startFrame={38}
            letterDelay={2}
            fontSize={56}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)", letterSpacing: -1 }}
          />
        </CameraShake>

        <div style={{ marginTop: 20 }}>
          <KineticWord
            text="30% des récoltes perdues chaque année"
            variant="spread"
            startFrame={55}
            letterDelay={2}
            fontSize={22}
            color="#ff3355"
            fontWeight={700}
            style={{ letterSpacing: 2, textShadow: "0 0 20px rgba(255,51,85,0.3)" }}
          />
        </div>
      </div>

      {frame >= 80 && (
        <TransitionOverlay type="dataMorph" duration={10} />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/ProblemScene.tsx
git commit -m "v2(scene): rewrite ProblemScene with split frame + kinetic text"
```

---

### Task 10: StatsScene rewrite

**Files:**
- Rewrite: `src/scenes/StatsScene.tsx`

**Context:** 3s scene. Numbers appear one by one with kinetic entrance. "1.3 MILLIARD" drops -> "200 M€" spreads -> "800 M" zooms -> all 3 pulse together on beat.

- [ ] **Step 1: Rewrite StatsScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";
import { DataRain } from "../components/DataRain";
import { ParticleField } from "../components/ParticleField";
import { TransitionOverlay } from "../components/TransitionOverlay";

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
            variant="drop"
            startFrame={10}
            letterDelay={3}
            fontSize={96}
            color="#ff3355"
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 0 40px rgba(255,51,85,0.3)" }}
          />
          <KineticWord
            text="de tonnes de nourriture gaspillées par an"
            variant="cascade"
            startFrame={35}
            letterDelay={2}
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
            startFrame={45}
            letterDelay={3}
            fontSize={96}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
          <KineticWord
            text="de pertes économiques en Europe"
            variant="cascade"
            startFrame={68}
            letterDelay={2}
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
            startFrame={80}
            letterDelay={4}
            fontSize={96}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3 }}
          />
          <KineticWord
            text="d'agriculteurs touchés dans le monde"
            variant="cascade"
            startFrame={103}
            letterDelay={2}
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

      {frame >= 80 && (
        <TransitionOverlay type="glitch" duration={10} />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/StatsScene.tsx
git commit -m "v2(scene): rewrite StatsScene with kinetic numbers + beat pulse"
```

---

### Task 11: SolutionScene rewrite

**Files:**
- Rewrite: `src/scenes/SolutionScene.tsx`

**Context:** 3s scene. NeuralNetwork grows from center -> "AgriScan.ai" letters from network nodes -> PhoneMockup slides in with rotation -> subtitle typing effect.

- [ ] **Step 1: Rewrite SolutionScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { NeuralNetwork } from "../components/NeuralNetwork";
import { KineticWord } from "../components/KineticWord";
import { PhoneMockup, ChatBubble } from "../components/PhoneMockup";
import { TransitionOverlay } from "../components/TransitionOverlay";

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
          variant="explode"
          startFrame={15}
          letterDelay={2}
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
          letterDelay={2}
          fontSize={24}
          color={COLORS.Lime}
          fontWeight={600}
          style={{ textShadow: `0 0 30px ${COLORS.Lime}44` }}
        />
      </div>

      {frame >= 80 && (
        <TransitionOverlay type="glitch" duration={10} direction="horizontal" />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/SolutionScene.tsx
git commit -m "v2(scene): rewrite SolutionScene with neural network reveal + phone rotation"
```

---

### Task 12: ChatbotScene rewrite

**Files:**
- Rewrite: `src/scenes/ChatbotScene.tsx`

**Context:** 3s scene. Phone zooms in from far -> chat bubbles fly fast (every 8-10f) -> data stream right side -> "Diagnostiquez en conversant" cascade.

- [ ] **Step 1: Rewrite ChatbotScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { PhoneMockup, ChatBubble } from "../components/PhoneMockup";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { TransitionOverlay } from "../components/TransitionOverlay";

export const ChatbotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneZoom = spring({
    frame,
    fps,
    config: { damping: 20, mass: 1.2, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.Black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 0,
          bottom: 0,
          width: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <DataRain density={15} speed={2} color={COLORS.Lime} opacity={0.12} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            transform: `scale(${0.3 + phoneZoom * 0.7})`,
            opacity: interpolate(frame, [0, 20], [0, 1]),
          }}
        >
          <PhoneMockup frame={frame} startFrame={0}>
            <ChatBubble text=" Bonjour ! Prenez une photo" isUser={false} frame={frame} appearAt={10} />
            <ChatBubble text="📸 *photo envoyée*" isUser={true} frame={frame} appearAt={20} />
            <ChatBubble text="Analyse en cours..." isUser={false} frame={frame} appearAt={28} />
            <ChatBubble text="🔍 Mildiou détecté à 97%" isUser={false} frame={frame} appearAt={38} />
            <ChatBubble text="Traitement: bouillie bordelaise" isUser={false} frame={frame} appearAt={46} />
            <ChatBubble text="Merci ! 🙏" isUser={true} frame={frame} appearAt={55} />
          </PhoneMockup>
        </div>

        <KineticWord
          text="Diagnostiquez en conversant"
          variant="cascade"
          startFrame={50}
          letterDelay={2}
          fontSize={26}
          color={COLORS.Cream}
          fontWeight={700}
          style={{ letterSpacing: 1 }}
        />
      </div>

      {frame >= 80 && (
        <TransitionOverlay type="dataMorph" duration={10} />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/ChatbotScene.tsx
git commit -m "v2(scene): rewrite ChatbotScene with fast chat + zoom entry"
```

---

### Task 13: MapScene rewrite

**Files:**
- Rewrite: `src/scenes/MapScene.tsx`

**Context:** 3s scene. Map appears with zoom+rotation -> pins drop fast (every 6f) -> kinetic title -> alert labels blink.

- [ ] **Step 1: Rewrite MapScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { MapDisplay } from "../components/MapDisplay";
import { KineticWord } from "../components/KineticWord";
import { DataRain } from "../components/DataRain";
import { CameraShake } from "../components/CameraShake";
import { TransitionOverlay } from "../components/TransitionOverlay";

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
          variant="drop"
          startFrame={20}
          letterDelay={3}
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
          startFrame={50}
          letterDelay={2}
          fontSize={18}
          color={COLORS.Cream}
          fontWeight={400}
          style={{ opacity: 0.6, letterSpacing: 2 }}
        />
      </div>

      {frame >= 80 && (
        <TransitionOverlay type="flash" duration={8} />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/MapScene.tsx
git commit -m "v2(scene): rewrite MapScene with zoom/rotate entry + shake"
```

---

### Task 14: DashboardScene rewrite

**Files:**
- Rewrite: `src/scenes/DashboardScene.tsx`

**Context:** 3s scene. Dashboard slides in with stretch -> metrics count with BeatPulse -> bar charts wave -> kinetic title -> zoom in.

- [ ] **Step 1: Rewrite DashboardScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { DashboardUI } from "../components/DashboardUI";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";
import { TransitionOverlay } from "../components/TransitionOverlay";

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
          startFrame={30}
          letterDelay={3}
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
          startFrame={55}
          letterDelay={2}
          fontSize={18}
          color={COLORS.Cream}
          fontWeight={400}
          style={{ opacity: 0.6, letterSpacing: 2 }}
        />
      </div>

      <BeatPulse bpm={120} amplitude={0.03} glow={false}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      </BeatPulse>

      {frame >= 80 && (
        <TransitionOverlay type="flash" duration={8} />
      )}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/DashboardScene.tsx
git commit -m "v2(scene): rewrite DashboardScene with stretch entry + beat pulse"
```

---

### Task 15: ClimaxScene rewrite

**Files:**
- Rewrite: `src/scenes/ClimaxScene.tsx`

**Context:** 5s scene - the big moment. SplitFrame 4 quadrants -> 4 kinetic lines -> light burst -> particle explosion -> CameraShake -> fade to point.

- [ ] **Step 1: Rewrite ClimaxScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { SplitFrame } from "../components/SplitFrame";
import { KineticWord } from "../components/KineticWord";
import { CameraShake } from "../components/CameraShake";
import { ParticleField } from "../components/ParticleField";
import { TransitionOverlay } from "../components/TransitionOverlay";

export const ClimaxScene: React.FC = () => {
  const frame = useCurrentFrame();

  const burst = interpolate(frame - 80, [0, 20], [0, 1], {
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
        style={{ opacity: interpolate(frame, [0, 30], [0, 0.5]) }}
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

      <CameraShake intensity={15} decay={40} frequency={4} rotation>
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
            startFrame={30}
            letterDelay={3}
            fontSize={78}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
          />
          <KineticWord
            text="VOS RÉCOLTES"
            variant="spread"
            startFrame={48}
            letterDelay={2}
            fontSize={78}
            color={COLORS.Cream}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
          />
          <div style={{ height: 8 }} />
          <KineticWord
            text="NOURRISSEZ"
            variant="drop"
            startFrame={68}
            letterDelay={3}
            fontSize={78}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
          <KineticWord
            text="LE MONDE"
            variant="zoom"
            startFrame={88}
            letterDelay={3}
            fontSize={78}
            color={COLORS.Lime}
            fontWeight={900}
            style={{ letterSpacing: -3, textShadow: `0 0 40px ${COLORS.Lime}44` }}
          />
        </div>
      </CameraShake>

      {frame > 70 && (
        <ParticleField
          count={50}
          colors={[COLORS.Lime, COLORS.Cream, "#ff3355"]}
          speed={1.5}
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/ClimaxScene.tsx
git commit -m "v2(scene): rewrite ClimaxScene with split + kinetic + burst + shake"
```

---

### Task 16: CTAScene rewrite

**Files:**
- Rewrite: `src/scenes/CTAScene.tsx`

**Context:** 2.5s closing. Logo zooms from lingering dot -> kinetic tagline -> store buttons spring in -> final pulse -> fade to black.

- [ ] **Step 1: Rewrite CTAScene**

```typescript
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { KineticWord } from "../components/KineticWord";
import { BeatPulse } from "../components/BeatPulse";
import { StoreButtons } from "../components/StoreButtons";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.Black,
        opacity: fadeOut,
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
        variant="explode"
        startFrame={5}
        letterDelay={2}
        fontSize={48}
        color={COLORS.Cream}
        fontWeight={900}
        style={{ letterSpacing: -2 }}
      />

      <KineticWord
        text="L'IA qui protège vos cultures"
        variant="cascade"
        startFrame={20}
        letterDelay={2}
        fontSize={18}
        color={COLORS.Lime}
        fontWeight={600}
        style={{ letterSpacing: 3, textTransform: "uppercase", opacity: 0.8 }}
      />

      <div style={{ marginTop: 8 }}>
        <StoreButtons frame={frame} startFrame={35} fps={fps} />
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
          opacity: interpolate(frame, [55, 75], [1, 0]),
          boxShadow: `0 0 20px ${COLORS.Lime}`,
        }}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/scenes/CTAScene.tsx
git commit -m "v2(scene): rewrite CTAScene with kinetic closing"
```

---

### Task 17: Update AgriScanTrailer.tsx + Root.tsx

**Files:**
- Modify: `src/AgriScanTrailer.tsx`
- Modify: `src/Root.tsx`

**Context:** Update composition with new 840f duration and scene timing.

- [ ] **Step 1: Rewrite AgriScanTrailer.tsx**

```typescript
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENE_TIMING } from "./design/tokens";
import { LogoScene } from "./scenes/LogoScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { StatsScene } from "./scenes/StatsScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { ChatbotScene } from "./scenes/ChatbotScene";
import { MapScene } from "./scenes/MapScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { ClimaxScene } from "./scenes/ClimaxScene";
import { CTAScene } from "./scenes/CTAScene";

export const AgriScanTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050D07" }}>
      <Sequence from={SCENE_TIMING.logo.from} durationInFrames={SCENE_TIMING.logo.duration}>
        <LogoScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.problem.from} durationInFrames={SCENE_TIMING.problem.duration}>
        <ProblemScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.stats.from} durationInFrames={SCENE_TIMING.stats.duration}>
        <StatsScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.solution.from} durationInFrames={SCENE_TIMING.solution.duration}>
        <SolutionScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.chatbot.from} durationInFrames={SCENE_TIMING.chatbot.duration}>
        <ChatbotScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.map.from} durationInFrames={SCENE_TIMING.map.duration}>
        <MapScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.dashboard.from} durationInFrames={SCENE_TIMING.dashboard.duration}>
        <DashboardScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.climax.from} durationInFrames={SCENE_TIMING.climax.duration}>
        <ClimaxScene />
      </Sequence>
      <Sequence from={SCENE_TIMING.cta.from} durationInFrames={SCENE_TIMING.cta.duration}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Update Root.tsx duration**

Root.tsx already uses `DURATION.total` so it will pick up the new 840f automatically. No changes needed.

- [ ] **Step 3: Run TypeScript check on whole project**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Render a still frame to verify**

Run: `npx remotion still AgriScanTrailer --scale=0.25 --frame=300`
Expected: exit 0, produces `out/frame.png`

- [ ] **Step 5: Commit**

```bash
git add src/AgriScanTrailer.tsx
git commit -m "v2(orchestration): update AgriScanTrailer with new 840f timing"
```
