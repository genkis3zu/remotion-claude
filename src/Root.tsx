import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { SimpleTextCard, simpleTextCardSchema } from "./SimpleTextCard";
import {
  VoicevoxVideo,
  voicevoxVideoSchema,
  VOICEVOX_VIDEO_DURATION,
} from "./VoicevoxVideo";
import { Main as VoicevoxTemplateMain } from "./voicevox-template/Main";
import { ModernTriviaVideo } from "./ModernTriviaVideo";
import { MyVideo } from "./Composition";
import { LongFormVideo } from "./LongFormVideo";
import { MainVideo, calculateTotalDuration } from "./MainVideo";
import scriptData from "./data/currentScript.json";
import fullScript from "./data/full_script.json";
import chapter1 from "./data/chapter1.json";


import { CharacterLayoutPreview, characterLayoutPreviewSchema } from "./compositions/CharacterLayoutPreview";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CharacterLayoutPreview"
        component={CharacterLayoutPreview}
        durationInFrames={300} // 10 seconds for preview
        fps={30}
        width={1920}
        height={1080}
        schema={characterLayoutPreviewSchema}
        defaultProps={{
          layout: {
            left: "zundamon",
            center: "none",
            right: "metan"
          },
          activeSpeaker: "zundamon",
          emotions: {
            left: "normal",
            center: "normal",
            right: "normal"
          }
        }}
      />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Simple text card - great for beginners! */}
      <Composition
        id="SimpleTextCard"
        component={SimpleTextCard}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={simpleTextCardSchema}
        defaultProps={{
          text: "Hello, Remotion!",
          textColor: "#ffffff",
          backgroundColor: "#000000",
          fontSize: 80,
        }}
      />

      {/* VOICEVOX Video - ずんだもん & めたん */}
      <Composition
        id="VoicevoxVideo"
        component={VoicevoxVideo}
        durationInFrames={VOICEVOX_VIDEO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={voicevoxVideoSchema}
        defaultProps={{
          backgroundColor: "#1a1a2e",
        }}
      />

      {/* Modern Trivia Video */}
      <Composition
        id="ModernTriviaVideo"
        component={ModernTriviaVideo}
        durationInFrames={VOICEVOX_VIDEO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Script Video (Automated) */}
      <Composition
        id="ScriptVideo"
        component={MyVideo}
        durationInFrames={Math.max(30, Math.ceil(scriptData.reduce((acc: number, item: any) => acc + (item.durationSec || 0), 0) * 30))}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Long Form Video (Chapter-based) */}
      <Composition
        id="LongFormVideo"
        component={LongFormVideo}
        durationInFrames={Math.max(30, Math.ceil([chapter1].reduce((acc, chapter) =>
          acc + chapter.items.reduce((cAcc, item) => cAcc + (item.durationSec * 30), 0), 0)))}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Main 10-Minute Video */}
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={calculateTotalDuration(fullScript as any)}
        fps={30}
        width={1920}
        height={1080}
      />


      {/* VoiceVox Template */}
      <Composition
        id="VoicevoxTemplate"
        component={VoicevoxTemplateMain}
        durationInFrames={300} // Default duration, will be calculated by component or requires prop
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
