import {
    AbsoluteFill,
    Audio,
    Series,
    Sequence,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { ModernCharacter } from "./components/ModernCharacter";
import { ModernSubtitle } from "./components/ModernSubtitle";
import { Background } from "./components/Background";
import { BentoGrid } from "./components/chuk-motion/BentoGrid";
import { TrueFocus } from "./components/chuk-motion/TrueFocus";
import { ProgressBar } from "./components/chuk-motion/ProgressBar";
import { scriptData, ScriptLine } from "./data/script";
import React from "react";

// Helper to calculate duration for a slice of script
const getSliceDuration = (lines: ScriptLine[]) =>
    lines.reduce((acc, line) => acc + line.durationInFrames + line.pauseAfter, 0);

const SegmentRenderer: React.FC<{
    lines: ScriptLine[];
    type: "hook" | "tempo" | "break" | "deep_dive";
}> = ({ lines, type }) => {
    const frame = useCurrentFrame();

    // Logic to find current line within this segment
    let currentLine: ScriptLine | null = null;
    let isSpeaking = false;
    let accumulatedFrames = 0;

    for (const line of lines) {
        const lineDuration = line.durationInFrames + line.pauseAfter;
        if (frame >= accumulatedFrames && frame < accumulatedFrames + lineDuration) {
            currentLine = line;
            isSpeaking = frame < accumulatedFrames + line.durationInFrames;
            break;
        }
        accumulatedFrames += lineDuration;
    }

    return (
        <AbsoluteFill>
            {type === "hook" && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    {/* Dynamic background for Hook */}
                    <TrueFocus text="THE HOOK IS HERE" />
                </div>
            )}

            {type === "tempo" && (
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                    <BentoGrid items={[
                        { id: "1", title: "Evidence A", content: <div className="h-full bg-blue-200/50 rounded" />, colSpan: 1 },
                        { id: "2", title: "Evidence B", content: <div className="h-full bg-red-200/50 rounded" />, colSpan: 1 },
                        { id: "3", title: "Key Point", content: <div className="h-full bg-green-200/50 rounded" />, colSpan: 2 },
                    ]} />
                </div>
            )}

            {/* Audio Playback handled by the second map below */}

            {/* Simple Audio Mapping (Series handles timing, but we need granular Audio tags?) 
                 Actually, simpler to just map Audio using absolute offsets relative to segment start 
              */}
            {lines.map((line, index) => {
                const startFrame = getSliceDuration(lines.slice(0, index));
                return (
                    <div key={`audio-wrapper-${line.id}`}>
                        <Sequence from={startFrame} durationInFrames={line.durationInFrames}>
                            <Audio src={staticFile(`voices/${line.voiceFile}`)} />
                        </Sequence>
                    </div>
                )
            })}


            {/* Characters */}
            <ModernCharacter
                characterId="metan"
                isSpeaking={isSpeaking && currentLine?.character === "metan"}
            />
            <ModernCharacter
                characterId="zundamon"
                isSpeaking={isSpeaking && currentLine?.character === "zundamon"}
            />

            {/* Subtitles */}
            {currentLine && isSpeaking && (
                <ModernSubtitle
                    text={currentLine.displayText ?? currentLine.text}
                    character={currentLine.character}
                />
            )}
        </AbsoluteFill>
    );
};

export const ModernTriviaVideo: React.FC = () => {
    const { durationInFrames } = useVideoConfig(); // Not used directly but available
    const frame = useCurrentFrame();

    // Split script into segments for demonstration
    // In real app, scriptData would be structured by chapters
    const hookLines = scriptData.slice(0, 2);
    const tempoLines = scriptData.slice(2, 4);
    const deepLines = scriptData.slice(4, 6);

    const hookDuration = getSliceDuration(hookLines);
    const tempoDuration = getSliceDuration(tempoLines);
    const deepDuration = getSliceDuration(deepLines);

    const totalDuration = hookDuration + tempoDuration + deepDuration;
    const progress = frame / totalDuration;

    return (
        <AbsoluteFill>
            <Background />

            <Series>
                <Series.Sequence durationInFrames={hookDuration}>
                    <SegmentRenderer lines={hookLines} type="hook" />
                </Series.Sequence>

                <Series.Sequence durationInFrames={tempoDuration}>
                    <SegmentRenderer lines={tempoLines} type="tempo" />
                </Series.Sequence>

                <Series.Sequence durationInFrames={deepDuration}>
                    <SegmentRenderer lines={deepLines} type="deep_dive" />
                </Series.Sequence>
            </Series>

            {/* Global Overlay - Progress Bar */}
            <ProgressBar progress={progress} segments={3} />
        </AbsoluteFill>
    );
};
