import { CharacterId } from "../config";

// アニメーションの型定義
export type AnimationType = "none" | "fadeIn" | "slideUp" | "slideLeft" | "zoomIn" | "bounce";

// ビジュアルの型定義
export interface VisualContent {
  type: "image" | "text" | "none";
  // 画像の場合: public/content/からの相対パス（例: "screenshot.png"）
  src?: string;
  // テキストの場合: 表示するテキスト
  text?: string;
  // テキストのスタイル
  fontSize?: number;
  color?: string;
  // 表示アニメーション（デフォルト: fadeIn）
  animation?: AnimationType;
}

// 効果音の型定義
export interface SoundEffect {
  // public/se/からの相対パス（例: "chime.mp3"）
  src: string;
  // 音量（0-1）
  volume?: number;
}

// BGM設定
export interface BGMConfig {
  // public/bgm/からの相対パス（例: "background.mp3"）
  src: string;
  // 音量（0-1）
  volume?: number;
  // ループするか
  loop?: boolean;
}

// BGM設定（動画全体で使用）
// 使用しない場合はnullまたはコメントアウト
export const bgmConfig: BGMConfig | null = null;
// 例:
// export const bgmConfig: BGMConfig = {
//   src: "background.mp3",
//   volume: 0.3,
//   loop: true,
// };

// セリフデータの型定義
export interface ScriptLine {
  id: number;
  character: CharacterId;
  text: string; // 音声生成用（カタカナ可）
  displayText?: string; // 字幕表示用（英語表記など）。なければtextを使用
  scene: number;
  voiceFile: string;
  durationInFrames: number; // fps * playbackRate基準
  pauseAfter: number; // セリフ後の間（フレーム数）
  emotion?: "normal" | "happy" | "surprised" | "thinking" | "sad" | "angry";
  pose?: string;
  // コンテンツエリアに表示するビジュアル
  visual?: VisualContent;
  // セリフ開始時に再生する効果音
  se?: SoundEffect;
}

// シーン定義
export interface SceneInfo {
  id: number;
  title: string;
  background: string;
}

// サンプルシーン定義
export const scenes: SceneInfo[] = [
  { id: 1, title: "オープニング", background: "gradient" },
  { id: 2, title: "メインコンテンツ", background: "solid" },
  { id: 3, title: "エンディング", background: "gradient" },
];

// デモ用スクリプトデータ
// このテンプレートをコピーしてすぐに動作確認できます
// セリフを編集後、npm run voices で音声を再生成してください
export const scriptData: ScriptLine[] = [
  {
    id: 1,
    character: "zundamon",
    text: "ずんだもんなのだ！新しい表情を覚えたのだ！",
    scene: 1,
    voiceFile: "01_zundamon.wav",
    durationInFrames: 53,
    pauseAfter: 15,
    emotion: "happy",
    pose: "hands_up",
    visual: {
      type: "text",
      text: "Remotion × VOICEVOX\n表情テスト",
      fontSize: 80,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 2,
    character: "metan",
    text: "あら、どんな表情ができるようになったの？",
    scene: 1,
    voiceFile: "02_metan.wav",
    durationInFrames: 44,
    pauseAfter: 15,
    emotion: "surprised",
    pose: "pointing",
  },
  {
    id: 3,
    character: "zundamon",
    text: "えっと、怒ったり、悲しんだり、色々できるようになったのだ...",
    scene: 1,
    voiceFile: "03_zundamon.wav",
    durationInFrames: 123,
    pauseAfter: 10,
    emotion: "thinking",
    pose: "confident",
  },
  {
    id: 4,
    character: "zundamon",
    text: "なんでそんなに疑う目で見るのだ！怒るぞ！",
    scene: 1,
    voiceFile: "04_zundamon_angry.wav",
    durationInFrames: 60,
    pauseAfter: 10,
    emotion: "angry",
    pose: "pointing",
  },
  {
    id: 5,
    character: "metan",
    text: "ごめんごめん、すごいじゃない。",
    scene: 1,
    voiceFile: "05_metan.wav",
    durationInFrames: 31,
    pauseAfter: 30,
    emotion: "happy",
    pose: "holding",
  },
  {
    id: 6,
    character: "tsumugi",
    text: "埼玉のギャル、春日部つむぎ参上！私もいるよー！",
    scene: 1,
    voiceFile: "06_tsumugi.wav",
    durationInFrames: 60,
    pauseAfter: 15,
    emotion: "happy",
    pose: "peace",
  },
  {
    id: 7,
    character: "tsumugi",
    text: "新しいポーズ、可愛いでしょ？",
    scene: 1,
    voiceFile: "07_tsumugi.wav",
    durationInFrames: 40,
    pauseAfter: 30,
    emotion: "happy",
    pose: "pointing",
  },
];

// VOICEVOXスクリプト生成用
export const generateVoicevoxScript = (
  data: ScriptLine[],
  characterSpeakerMap: Record<CharacterId, number>
) => {
  return data.map((line) => ({
    id: line.id,
    character: line.character,
    speakerId: characterSpeakerMap[line.character],
    text: line.text, // 音声生成はtextを使用
    outputFile: line.voiceFile,
  }));
};
