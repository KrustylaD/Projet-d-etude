import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../design/tokens";
import { softSpring } from "../animations/springs";

export const StoreButtons: React.FC<{
  frame: number;
  startFrame: number;
  fps: number;
}> = ({ frame, startFrame, fps }) => {
  const localFrame = frame - startFrame;

  const appleEnter = softSpring(localFrame - 10, fps);
  const googleEnter = softSpring(localFrame - 25, fps);

  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 28px",
          backgroundColor: COLORS.Black,
          border: `1px solid ${COLORS.Slate}`,
          borderRadius: 14,
          opacity: appleEnter,
          transform: `translateY(${(1 - appleEnter) * 30}px) scale(${appleEnter})`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={COLORS.Cream}>
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 9, color: COLORS.Cream, opacity: 0.6 }}>
            Télécharger sur
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 700, color: COLORS.Cream }}>
            App Store
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 28px",
          backgroundColor: COLORS.Black,
          border: `1px solid ${COLORS.Slate}`,
          borderRadius: 14,
          opacity: googleEnter,
          transform: `translateY(${(1 - googleEnter) * 30}px) scale(${googleEnter})`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={COLORS.Cream}>
          <path d="M3 20.5v-17l14 8.5-14 8.5zm1-14.5v4l8 2-8 2v4l10-6-10-6z"/>
        </svg>
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 9, color: COLORS.Cream, opacity: 0.6 }}>
            Disponible sur
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 700, color: COLORS.Cream }}>
            Google Play
          </div>
        </div>
      </div>
    </div>
  );
};
