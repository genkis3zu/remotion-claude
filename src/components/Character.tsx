import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { CharacterId, CHARACTER_CONFIG } from "../data/script";

interface CharacterProps {
  characterId: CharacterId;
  isSpeaking: boolean;
}

export const Character: React.FC<CharacterProps> = ({
  characterId,
  isSpeaking,
}) => {
  const frame = useCurrentFrame();
  const config = CHARACTER_CONFIG[characterId];
  const isLeft = config.position === "left";

  // 口パクアニメーション（約6fpsで開閉）
  const mouthOpen = isSpeaking ? Math.floor(frame / 5) % 2 === 0 : false;

  // 話している時の上下揺れ
  const bounceY = isSpeaking
    ? interpolate(Math.sin(frame * 0.3), [-1, 1], [-3, 3])
    : 0;

  // 登場アニメーション
  const slideIn = interpolate(frame, [0, 15], [isLeft ? -200 : 200, 0], {
    extrapolateRight: "clamp",
  });

  const imagePath = `images/${characterId}/${mouthOpen ? "mouth_open" : "mouth_close"}.png`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        [config.position]: slideIn,
        transform: `translateY(${bounceY}px)`,
      }}
    >
      <Img
        src={staticFile(imagePath)}
        style={{
          height: 400,
          objectFit: "contain",
        }}
      />
    </div>
  );
};
