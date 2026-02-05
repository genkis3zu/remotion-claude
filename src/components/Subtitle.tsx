import { CharacterId, CHARACTER_CONFIG } from "../data/script";

interface SubtitleProps {
  text: string;
  character: CharacterId;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, character }) => {
  const config = CHARACTER_CONFIG[character];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: "#ffffff",
          textShadow: `
            -3px -3px 0 ${config.color},
            3px -3px 0 ${config.color},
            -3px 3px 0 ${config.color},
            3px 3px 0 ${config.color},
            -3px 0 0 ${config.color},
            3px 0 0 ${config.color},
            0 -3px 0 ${config.color},
            0 3px 0 ${config.color}
          `,
          padding: "10px 30px",
          maxWidth: "80%",
          textAlign: "center",
          fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
        }}
      >
        {text}
      </div>
    </div>
  );
};
