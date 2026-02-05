// セリフデータの型定義
export type CharacterId = "zundamon" | "metan" | "tsumugi";

export interface ScriptLine {
  id: number;
  character: CharacterId;
  text: string;           // 音声生成用（カタカナ可）
  displayText?: string;   // 字幕用（英語表記など）
  voiceFile: string;
  durationInFrames: number;
  pauseAfter: number;     // セリフ後の間（フレーム数）
}

// キャラクター設定
export const CHARACTER_CONFIG: Record<CharacterId, {
  name: string;
  speakerId: number;  // VOICEVOX Speaker ID
  color: string;
  position: "left" | "right";
}> = {
  metan: {
    name: "四国めたん",
    speakerId: 2,
    color: "#FF1493",
    position: "left",
  },
  zundamon: {
    name: "ずんだもん",
    speakerId: 3,
    color: "#228B22",
    position: "right",
  },
  tsumugi: {
    name: "春日部つむぎ",
    speakerId: 8,
    color: "#FFA500", // Orange
    position: "left",
  },
};

// African Cuisine Script
export const scriptData: ScriptLine[] = [
  {
    id: 1,
    character: "metan",
    text: "アフリカ料理の世界へようこそ！今日は知られざるグルメを紹介するわ。",
    displayText: "アフリカ料理の世界へようこそ！",
    voiceFile: "africa_01_metan.mp3",
    durationInFrames: 143,
    pauseAfter: 15,
  },
  {
    id: 2,
    character: "zundamon",
    text: "アフリカの料理？全然イメージがわかないのだ。",
    displayText: "アフリカ料理...？",
    voiceFile: "africa_02_zundamon.mp3",
    durationInFrames: 125,
    pauseAfter: 15,
  },
  {
    id: 3,
    character: "metan",
    text: "まずは南アフリカの「バニーチャウ」。パンをくり抜いてカレーを詰めた料理よ。",
    displayText: "南アフリカ：バニーチャウ",
    voiceFile: "africa_03_metan.mp3",
    durationInFrames: 163,
    pauseAfter: 15,
  },
  {
    id: 4,
    character: "zundamon",
    text: "パンが器になっているのだ！？豪快でおいしそうなのだ！",
    displayText: "パンが器に！？",
    voiceFile: "africa_04_zundamon.mp3",
    durationInFrames: 133,
    pauseAfter: 15,
  },
  {
    id: 5,
    character: "metan",
    text: "次は西アフリカの「ジョロフライス」。スパイシーなトマトベースの炊き込みご飯ね。",
    displayText: "西アフリカ：ジョロフライス",
    voiceFile: "africa_05_metan.mp3",
    durationInFrames: 169,
    pauseAfter: 15,
  },
  {
    id: 6,
    character: "zundamon",
    text: "赤くて辛そうなのだ！食欲をそそるのだ！",
    displayText: "赤くて辛そう！",
    voiceFile: "africa_06_zundamon.mp3",
    durationInFrames: 106,
    pauseAfter: 30,
  },
];

// 総フレーム数を計算
export const getTotalDuration = (): number => {
  return scriptData.reduce(
    (total, line) => total + line.durationInFrames + line.pauseAfter,
    0
  );
};
