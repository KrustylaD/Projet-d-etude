import { Composition } from "remotion";
import { AgriScanTrailer } from "./AgriScanTrailer";
import { DURATION, loadFont, loadInter, loadJetBrains } from "./design/tokens";

const { fontFamily } = loadFont();
loadInter();
loadJetBrains();

export const RemotionRoot = () => {
  return (
    <Composition
      id="AgriScanTrailer"
      component={AgriScanTrailer}
      durationInFrames={DURATION.total}
      fps={DURATION.fps}
      width={DURATION.width}
      height={DURATION.height}
    />
  );
};
