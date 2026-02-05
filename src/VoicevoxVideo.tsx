import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Character } from "./components/Character";
import { Subtitle } from "./components/Subtitle";
import { scriptData, ScriptLine, getTotalDuration } from "./data/script";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Props schema
export const voicevoxVideoSchema = z.object({
  backgroundColor: zColor(),
});

type Props = z.infer<typeof voicevoxVideoSchema>;

// 各セリフの開始フレームを計算
const getLineStartFrame = (index: number): number => {
  let startFrame = 0;
  for (let i = 0; i < index; i++) {
    startFrame += scriptData[i].durationInFrames + scriptData[i].pauseAfter;
  }
  return startFrame;
};

export const VoicevoxVideo: React.FC<Props> = ({ backgroundColor }) => {
  const frame = useCurrentFrame();

  // 現在のセリフを特定
  let currentLine: ScriptLine | null = null;
  let isSpeaking = false;

  let accumulatedFrames = 0;
  for (const line of scriptData) {
    const lineEndFrame = accumulatedFrames + line.durationInFrames + line.pauseAfter;

    if (frame >= accumulatedFrames && frame < lineEndFrame) {
      currentLine = line;
      isSpeaking = frame < accumulatedFrames + line.durationInFrames;
      break;
    }
    accumulatedFrames = lineEndFrame;
  }

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 音声再生 */}
      {scriptData.map((line, index) => {
        const startFrame = getLineStartFrame(index);
        return (
          <Sequence
            key={`audio-${line.id}`}
            from={startFrame}
            durationInFrames={line.durationInFrames}
          >
            <Audio src={staticFile(`voices/${line.voiceFile}`)} />
          </Sequence>
        );
      })}

      {/* キャラクター */}
      <Character
        characterId="metan"
        isSpeaking={isSpeaking && currentLine?.character === "metan"}
      />
      <Character
        characterId="zundamon"
        isSpeaking={isSpeaking && currentLine?.character === "zundamon"}
      />

      {/* 字幕 */}
      {currentLine && isSpeaking && (
        <Subtitle
          text={currentLine.displayText ?? currentLine.text}
          character={currentLine.character}
        />
      )}
    </AbsoluteFill>
  );
};

// 総フレーム数をエクスポート
export const VOICEVOX_VIDEO_DURATION = getTotalDuration();
