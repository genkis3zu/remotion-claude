import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig, staticFile } from 'remotion';
import { z } from 'zod';
import { DynamicStage } from './components/DynamicStage';
import { SmartImage } from './components/SmartImage';
import { ChapterSchema } from './types';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import fullScript from './data/full_script.json';

// Define the full script type based on the JSON structure
const FullScriptSchema = z.array(ChapterSchema);

// Calculate total duration based on the script
// Note: This logic might need to be in index.ts to set the composition duration dynamically,
// but we can also use it here for internal logic.
export const calculateTotalDuration = (chapters: z.infer<typeof FullScriptSchema>) => {
    return chapters.reduce((total, chapter) => {
        return total + chapter.items.reduce((chTotal, item) => chTotal + ((item.durationSec + 0.8) * 30), 0);
    }, 0) + (180); // Add Intro + Outro (90 + 90 frames)
};

// Map moods to BGM filenames
const bgmMap: Record<string, string> = {
    playful: "bgm/Cat_life.mp3",
    serious: "bgm/審判の日.mp3",
    mysterious: "bgm/神隠しの真相.mp3",
    relaxing: "bgm/Morning.mp3",
    energetic: "bgm/夏はsummer!!.mp3",
};

// Helper to determine SE based on context
const getSeSrc = (item: any): string | null => {
    const text = item.text || "";
    const prompt = item.insertImagePrompt || "";
    const bgPrompt = item.backgroundPrompt || "";
    const emotion = item.emotion || "normal";

    if (prompt.includes("ハリセン") || prompt.includes("叩く") || text.includes("痛い")) {
        return "se/anime/ビシッとツッコミ1.mp3";
    }
    if (emotion === "surprised" || text.includes("えっ") || text.includes("なんだって")) {
        return "se/anime/ショック1.mp3";
    }
    if (bgPrompt.includes("集中線") || prompt.includes("集中線") || text.includes("注目")) {
        return "se/anime/バーン.mp3";
    }
    if (emotion === "smug" || item.thoughtProcess?.includes("ひらめき")) {
        // "hirameku" sound
        return "se/anime/ひらめく1.mp3";
    }

    return null;
};

export const MainVideo: React.FC = () => {
    const { fps } = useVideoConfig();
    const chapters = FullScriptSchema.parse(fullScript);
    const INTRO_DURATION = 90; // 3 seconds
    const OUTRO_DURATION = 90; // 3 seconds

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Intro Sequence */}
            <Sequence durationInFrames={INTRO_DURATION}>
                <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: 'white', fontSize: 100, fontFamily: 'sans-serif' }}>Opening</h1>
                </AbsoluteFill>
            </Sequence>

            {/* Main Content */}
            <Sequence from={INTRO_DURATION}>
                <TransitionSeries>
                    {chapters.map((chapter, chIdx) => {
                        // Calculate chapter duration in frames (buffered)
                        const chapterDurationInFrames = Math.ceil(
                            chapter.items.reduce((acc, item) => acc + (item.durationSec + 2.0) * fps, 0)
                        );

                        // Determine BGM for this chapter
                        const mood = (chapter as any).mood || "playful";
                        const bgmSrc = staticFile(bgmMap[mood] || bgmMap["playful"]);

                        const sequence = (
                            <TransitionSeries.Sequence key={chIdx} durationInFrames={chapterDurationInFrames}>
                                {/* Chapter BGM */}
                                <Audio
                                    src={bgmSrc}
                                    loop
                                    volume={0.05} // Lower volume
                                />

                                {/* Background Layer (Visuals + SE) */}
                                <AbsoluteFill>
                                    {chapter.items.map((item, itemIdx) => {
                                        // Determine duration and start frame for this item relative to the chapter
                                        // Increase buffer to 2.0s to ensure audio completion and pause
                                        const BUFFER_SEC = 2.0;
                                        // Calculate duration as integer frames
                                        const itemDuration = Math.ceil((item.durationSec + BUFFER_SEC) * fps);

                                        // Calculate start frame by summing previous INTEGER durations
                                        const listBefore = chapter.items.slice(0, itemIdx);
                                        const startFrame = listBefore.reduce((acc, i) => acc + Math.ceil((i.durationSec + BUFFER_SEC) * fps), 0);

                                        // 1. Background Image
                                        let bgSrc = "";
                                        for (let i = itemIdx; i >= 0; i--) {
                                            if (chapter.items[i].backgroundPrompt) {
                                                bgSrc = staticFile(`assets/bg/bg_${chIdx}_${i}.png`);
                                                break;
                                            }
                                        }
                                        if (!bgSrc && chIdx > 0) {
                                            bgSrc = staticFile(`assets/bg/bg_0_0.png`);
                                        }
                                        if (!bgSrc) bgSrc = staticFile("assets/bg/bg_0_0.png");

                                        // 2. Audio (Voice)
                                        const audioSrc = staticFile(`voice/${chapter.title}_${itemIdx}.wav`);

                                        // 3. SE (Sound Effect)
                                        const seFilename = getSeSrc(item);
                                        const seSrc = seFilename ? staticFile(seFilename) : null;

                                        return (
                                            <Sequence
                                                key={`item-${chIdx}-${itemIdx}`}
                                                from={startFrame}
                                                durationInFrames={itemDuration}
                                            >
                                                {/* Active Background with fade-in effect to smooth transitions */}
                                                <AbsoluteFill>
                                                    <div style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        // Apply fade-in animation
                                                        animationName: 'fadeIn',
                                                        animationDuration: '1s',
                                                        animationFillMode: 'forwards'
                                                    }}>
                                                        <style>
                                                            {`
                                                                @keyframes fadeIn {
                                                                    from { opacity: 0; }
                                                                    to { opacity: 1; }
                                                                }
                                                            `}
                                                        </style>
                                                        <Img
                                                            src={bgSrc}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </AbsoluteFill>

                                                {/* Audio (Voice) */}
                                                <Audio src={audioSrc} />

                                                {/* SE */}
                                                {seSrc && (
                                                    <Audio src={seSrc} volume={0.5} />
                                                )}

                                                {/* Characters (DynamicStage) */}
                                                <DynamicStage
                                                    leftCharacter={item.layout.left}
                                                    rightCharacter={item.layout.right}
                                                    centerCharacter={item.layout.center}
                                                    activeSpeaker={item.activeSpeaker}
                                                    leftEmotion={item.activeSpeaker === item.layout.left ? item.emotion : "normal"}
                                                    rightEmotion={item.activeSpeaker === item.layout.right ? item.emotion : "normal"}
                                                    centerEmotion={item.activeSpeaker === item.layout.center ? item.emotion : "normal"}
                                                />

                                                {/* Insert Image (Overlay) */}
                                                {item.insertImagePrompt && (
                                                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                                                        <SmartImage
                                                            src={staticFile(`assets/inserts/insert_${chIdx}_${itemIdx}.png`)}
                                                            type="insert"
                                                        />
                                                    </AbsoluteFill>
                                                )}

                                                {/* Subtitles / Text */}
                                                <AbsoluteFill style={{ top: '80%', padding: '20px', alignItems: 'center', zIndex: 200 }}>
                                                    <div style={{
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        color: 'white',
                                                        padding: '20px',
                                                        borderRadius: '15px',
                                                        fontSize: '32px',
                                                        textAlign: 'center',
                                                        maxWidth: '90%'
                                                    }}>
                                                        {item.text}
                                                    </div>
                                                </AbsoluteFill>

                                            </Sequence>
                                        );
                                    })}
                                </AbsoluteFill>
                            </TransitionSeries.Sequence>
                        );

                        if (chIdx < chapters.length - 1) {
                            return (
                                <>
                                    {sequence}
                                    <TransitionSeries.Transition
                                        presentation={fade()}
                                        timing={linearTiming({ durationInFrames: 30 })}
                                    />
                                </>
                            );
                        }
                        return sequence;
                    })}
                </TransitionSeries>
            </Sequence>

            {/* Outro Sequence */}
            {/* We need to calculate start frame for Outro dynamically or relative to Main content end */}
            {/* Since main content length is dynamic, using 'from' here is tricky if we don't know total length upfront easily. */}
            {/* However, Sequence flows. Wait, Sequence needs absolute 'from' unless inside a Series. */}
            {/* We are NOT in a Series here for the top level structure. */}
            {/* We calculated total duration in calculateTotalDuration but that doesn't account for Intro. */}
            {/* Let's rely on the fact that Main Content Sequence ends, but we need to position Outro. */}
            {/* Actually, easier to use Series for the Top Level too! */}
            {/* BUT TransitionSeries is used for chapters. */}
            {/* Let's wrap Intro, Main(TransitionSeries), Outro in a simple Series? */}
            {/* TransitionSeries doesn't nest nicely inside Series? It should. */}

            {/* Alternative: Use calculateTotalDuration to determine Outro start */}
            <Sequence from={INTRO_DURATION + calculateTotalDuration(chapters)} durationInFrames={OUTRO_DURATION}>
                <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: 'white', fontSize: 100, fontFamily: 'sans-serif' }}>Ending</h1>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
