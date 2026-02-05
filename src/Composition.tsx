import { Series, Audio, staticFile, Img } from 'remotion';
// @ts-ignore - Importing json might require configuration, but usually works in modern setups
import scriptDataRaw from './data/currentScript.json';
import { Stage } from './components/Stage';
import { ScriptSubtitle as Subtitle } from './components/ScriptSubtitle';
import { Script } from './types';

// Validate or cast script data
const scriptData = scriptDataRaw as unknown as Script;

export const MyVideo = () => {
    return (
        <Series>
            {scriptData.map((item, index) => {
                // Voicevox skill will generate files: 000.wav, 001.wav, etc.
                // Or maybe we should use ID if available? User prompt used index.
                const audioPath = staticFile(`voice/${index.toString().padStart(3, '0')}.wav`);

                return (
                    <Series.Sequence key={index} durationInFrames={Math.ceil(item.durationSec * 30)}>
                        {/* Audio with error handling logic (Remotion Audio doesn't have onError, but if file missing it won't play) */}
                        <Audio src={audioPath} />

                        {/* Background - using a placeholder or default */}
                        <Img src={staticFile("bg/classroom.png")} style={{ position: 'absolute', zIndex: -1, width: '100%', height: '100%' }} />

                        {/* Character Stage Logic */}
                        <Stage
                            layout={item.layout}
                            activeSpeaker={item.activeSpeaker}
                            emotions={{
                                left: item.activeSpeaker === item.layout.left ? item.emotion : "normal",
                                right: item.activeSpeaker === item.layout.right ? item.emotion : "normal",
                                center: item.activeSpeaker === item.layout.center ? item.emotion : "normal"
                            }}
                        />

                        {/* Subtitle */}
                        <Subtitle text={item.text} character={item.character} />
                    </Series.Sequence>
                );
            })}
        </Series>
    );
};
