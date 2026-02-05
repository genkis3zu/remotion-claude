import React from "react";
import { Series, Audio, staticFile, AbsoluteFill, interpolate, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { Stage } from "./components/Stage";
import { ScriptSubtitle } from "./components/ScriptSubtitle";
import { Background } from "./components/Background";
import { HookTitle } from "./components/HookTitle";
import { SplitScreen } from "./components/SplitScreen";
import { BentoGrid } from "./components/chuk-motion/BentoGrid";
import chapter1 from "./data/chapter1.json";
import chapterSample from "./data/chapters_sample.json";
import { Mood, Layout, CharId, SectionType, VisualStyle, VisualContent } from "./types";

// For now, manually list chapters. 
// In a fully automated setup, this file could be generated or dynamically import all jsons.
// Using sample chapter to demonstrate new features (Hook, Split, Bento)
const chapters = chapterSample;

// Map moods to BGM filenames
const bgmMap: Record<Mood, string> = {
    playful: "bgm/Cat_life.mp3",
    serious: "bgm/審判の日.mp3",
    mysterious: "bgm/神隠しの真相.mp3",
    relaxing: "bgm/Morning.mp3",
    energetic: "bgm/夏はsummer!!.mp3",
};

const ChapterSequence: React.FC<{
    chapter: typeof chapter1;
    chapterIndex: number;
}> = ({ chapter, chapterIndex }) => {
    // Default to playful if mood is missing or invalid (fallback)
    const mood = ((chapter as any).mood || "playful") as Mood;
    const section = ((chapter as any).segment) as SectionType | undefined;
    const visualStyle = ((chapter as any).visualStyle) as VisualStyle | undefined;
    const visualContent = ((chapter as any).visualContent) as VisualContent | undefined;
    const bgmSource = staticFile(bgmMap[mood]);

    // Calculate total duration of this chapter
    const totalDuration = chapter.items.reduce((acc, item) => acc + Math.ceil((item.durationSec || 2) * 30), 0);

    return (
        <AbsoluteFill>
            <Audio
                src={bgmSource}
                loop
                volume={(f) =>
                    interpolate(f, [0, 30, totalDuration - 30, totalDuration], [0, 0.1, 0.1, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    })
                }
                onError={(e) => console.warn(`BGM not found: ${bgmSource}`)}
            />

            {section === 'hook' ? (
                // Special rendering for Hook
                <Sequence durationInFrames={totalDuration}>
                    <HookTitle
                        text={chapter.items[0]?.text || chapter.title}
                        highlightWords={(chapter.items[0] as any).highlightWords}
                    />
                    {/* Still play audio for the hook? Yes. */}
                    {chapter.items.map((item, itemIndex) => {
                        const audioPath = `voice/${chapter.title}_${itemIndex}.wav`;
                        const durationInFrames = Math.ceil((item.durationSec || 2) * 30);
                        // We need to sequence the audio correctly
                        // The hook might have multiple lines?
                        // If HookTitle covers the WHOLE duration, we just play underlying audio.
                        // But visual doesn't change? HookTitle usually animates the text.
                        // Let's iterate `from` based on previous durations
                        let startFrame = 0;
                        for (let i = 0; i < itemIndex; i++) {
                            startFrame += Math.ceil((chapter.items[i].durationSec || 2) * 30);
                        }

                        return (
                            <Sequence key={itemIndex} from={startFrame} durationInFrames={durationInFrames}>
                                <Audio src={staticFile(audioPath)} />
                            </Sequence>
                        )
                    })}
                </Sequence>
            ) : (
                // Standard rendering for other sections (Intro, Body, Break, Outro)
                <AbsoluteFill>
                    {/* Background Layer: Varies by visualStyle */}
                    <AbsoluteFill style={{ zIndex: 0 }}>
                        {visualStyle === 'split' ? (
                            <SplitScreen imageUrl={visualContent?.imageUrl}>
                                {/* Content for split screen could be titles? For now just visual layout */}
                            </SplitScreen>
                        ) : visualStyle === 'bento' ? (
                            <AbsoluteFill className="bg-slate-100">
                                <BentoGrid items={visualContent?.bentoItems || []} />
                            </AbsoluteFill>
                        ) : (
                            <Background />
                        )}
                    </AbsoluteFill>

                    {/* Character and Dialogue Layer */}
                    <Series>
                        {chapter.items.map((item, itemIndex) => {
                            const audioPath = `voice/${chapter.title}_${itemIndex}.wav`;
                            const durationInFrames = Math.ceil((item.durationSec || 2) * 30);

                            return (
                                <Series.Sequence
                                    key={`${chapterIndex}-${itemIndex}`}
                                    durationInFrames={durationInFrames}
                                >
                                    <AbsoluteFill>
                                        <Stage
                                            layout={(item.layout as Layout) || { left: "zundamon", right: "metan", center: "none" }}
                                            activeSpeaker={(item.activeSpeaker as CharId) || item.character}
                                            emotions={{
                                                left: (item.activeSpeaker as any) === (item.layout as any).left ? item.emotion : "normal",
                                                right: (item.activeSpeaker as any) === (item.layout as any).right ? item.emotion : "normal",
                                                center: (item.activeSpeaker as any) === (item.layout as any).center ? item.emotion : "normal"
                                            }}
                                        />

                                        {/* Subtitles */}
                                        <ScriptSubtitle
                                            text={item.text}
                                            character={item.character as any}
                                        />

                                        {/* Audio */}
                                        <Audio
                                            src={staticFile(audioPath)}
                                            onError={(e) => console.warn(`Audio not found: ${audioPath}`)}
                                        />
                                    </AbsoluteFill>
                                </Series.Sequence>
                            );
                        })}
                    </Series>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

export const LongFormVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "white" }}>
            <Background />
            <TransitionSeries>
                {chapters.map((chapter: any, index) => {
                    const duration = chapter.items.reduce((acc: number, item: any) => acc + Math.ceil((item.durationSec || 2) * 30), 0);
                    const section = (chapter as any).segment as SectionType | undefined;
                    const nextSection = (chapters[index + 1] as any)?.segment as SectionType | undefined;

                    // Determine transition type
                    // If current or next is 'break', use wipe. Else fade.
                    const isBreakTransition = section === 'break' || nextSection === 'break';

                    return (
                        <React.Fragment key={index}>
                            <TransitionSeries.Sequence durationInFrames={duration}>
                                <ChapterSequence chapter={chapter} chapterIndex={index} />
                            </TransitionSeries.Sequence>

                            {/* Add transition if not the last chapter */}
                            {index < chapters.length - 1 && (
                                <TransitionSeries.Transition
                                    presentation={(isBreakTransition ? wipe() : fade()) as any}
                                    timing={linearTiming({ durationInFrames: 30 })}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </TransitionSeries>
        </AbsoluteFill>
    );
};
