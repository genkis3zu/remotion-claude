import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { DEFAULT_CHARACTERS, CharacterId } from "../config";
import { SETTINGS, AVAILABLE_IMAGES } from "../settings.generated";

interface CharacterProps {
  characterId: CharacterId;
  isSpeaking: boolean;
  emotion?: string;
  pose?: string;
}

// 表情に応じた画像ファイル名を取得（存在チェック付き）
const getImageFileName = (
  characterId: string,
  emotion: string,
  pose: string,
  mouthOpen: boolean
): string => {
  const state = mouthOpen ? "open" : "close";
  const availableFiles = AVAILABLE_IMAGES[characterId] || [];

  // 1. Try pose folder with emotion
  // e.g. "pointing/happy_open.png"
  const posePrefix = pose ? `${pose}/` : "";

  // Try exact emotion in pose folder
  const emotionFile = `${posePrefix}${emotion}_${state}.png`;
  if (availableFiles.includes(emotionFile)) {
    return emotionFile;
  }

  // Try normal emotion in pose folder (fallback for missing emotions in pose)
  const normalFile = `${posePrefix}mouth_${state}.png`;
  if (availableFiles.includes(normalFile)) {
    return normalFile;
  }

  // Backwards compatibility / Fallback to root or normal folder
  // If pose is "normal" but not found in "normal/" (maybe old structure?), try root
  if (pose === "normal") {
    const rootFile = `mouth_${state}.png`;
    if (availableFiles.includes(rootFile)) {
      return rootFile;
    }
    // Try root emotion
    const rootEmotion = `${emotion}_${state}.png`;
    if (availableFiles.includes(rootEmotion)) {
      return rootEmotion;
    }
  }

  // Cross-pose fallback:
  // If specific emotion missing in requested pose, maybe use normal pose's emotion?
  // e.g. "pointing/surprised" missing -> "normal/surprised"
  if (pose !== "normal") {
    const fallbackFile = `normal/${emotion}_${state}.png`;
    if (availableFiles.includes(fallbackFile)) {
      return fallbackFile;
    }
    const fallbackNormal = `normal/mouth_${state}.png`;
    if (availableFiles.includes(fallbackNormal)) {
      return fallbackNormal;
    }
  }

  // Final fallback
  return `mouth_${state}.png`;
};

export const Character: React.FC<CharacterProps> = ({
  characterId,
  isSpeaking,
  emotion = "normal",
  pose = "normal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const characterConfig = DEFAULT_CHARACTERS.find((c) => c.id === characterId);

  if (!characterConfig) {
    return null;
  }

  const isLeft = characterConfig.position === "left";

  // 口パクアニメーション（話している時、約6fpsで口を開閉）
  const mouthOpen = isSpeaking ? Math.floor(frame / 5) % 2 === 0 : false;

  // 話している時のアニメーション（上下に揺れる）
  const bounceY = isSpeaking
    ? interpolate(Math.sin(frame * 0.3), [-1, 1], [-3, 3])
    : 0;

  // 登場アニメーション（画面端からスライドイン）
  const slideIn = interpolate(frame, [0, fps * 0.5], [isLeft ? -200 : 200, 0], {
    extrapolateRight: "clamp",
  });

  // スケールは常に1（サイズ変更なし）
  const scale = 1;

  // 画像パスを取得（表情差分対応、存在チェック付き）
  // Note: generate-expressions.py now creates subfolders.
  // sync-settings.ts now returns relative paths like "normal/happy_open.png".
  // So currentImage should be `${basePath}/${characterId}/${imageFileName}`.
  // imageFileName will contain the "pose/" prefix.
  const basePath = SETTINGS.character.imagesBasePath;
  const imageFileName = getImageFileName(characterId, emotion, pose, mouthOpen);
  const currentImage = `${basePath}/${characterId}/${imageFileName}`;

  // 設定ファイルのuseImagesフラグをチェック
  const hasImage = SETTINGS.character.useImages;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        [characterConfig.position]: slideIn,
        transform: `translateY(${bounceY}px) scale(${scale})`,
        transformOrigin: isLeft ? "bottom left" : "bottom right",
      }}
    >
      {hasImage ? (
        <Img
          src={staticFile(currentImage)}
          style={{
            height: SETTINGS.character.height,
            objectFit: "contain",
            transform: characterConfig.flipX ? "scaleX(-1)" : "none",
          }}
        />
      ) : (
        // 画像がない場合のプレースホルダー
        <div
          style={{
            width: 200,
            height: 300,
            background: `${characterConfig.color}20`,
            border: `4px solid ${characterConfig.color}`,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 48 }}>
            {characterId === "zundamon" ? "🟢" : "🩷"}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: characterConfig.color,
              marginTop: 8,
            }}
          >
            {characterConfig.name}
          </div>
        </div>
      )}
    </div>
  );
};
