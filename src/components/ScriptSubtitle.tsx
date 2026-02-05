import { Character } from "../types";

interface ScriptSubtitleProps {
    text: string;
    character?: Character; // Optional if we want to change color based on character
}

// Character colors
const CHAR_COLORS: Record<string, string> = {
    zundamon: "#3EA021", // Greenish
    metan: "#A83E6C",    // Pinkish/Purple
    tsumugi: "#DCDCDC",  // White/Yellowish? using generic
};

export const ScriptSubtitle: React.FC<ScriptSubtitleProps> = ({ text, character }) => {
    const outlineColor = character && CHAR_COLORS[character] ? CHAR_COLORS[character] : "#000000";

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
            -3px -3px 0 ${outlineColor},
            3px -3px 0 ${outlineColor},
            -3px 3px 0 ${outlineColor},
            3px 3px 0 ${outlineColor},
            -3px 0 0 ${outlineColor},
            3px 0 0 ${outlineColor},
            0 -3px 0 ${outlineColor},
            0 3px 0 ${outlineColor}
          `,
                    padding: "10px 30px",
                    textAlign: "center",
                    fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
                    maxWidth: "90%",
                }}
            >
                {text}
            </div>
        </div>
    );
};
