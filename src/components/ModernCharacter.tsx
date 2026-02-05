import { Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { CharacterId, CHARACTER_CONFIG } from "../data/script";


interface CharacterProps {
    characterId: CharacterId;
    isSpeaking: boolean;
}

export const ModernCharacter: React.FC<CharacterProps> = ({
    characterId,
    isSpeaking,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const config = CHARACTER_CONFIG[characterId];
    const isLeft = config.position === "left";

    // Mouth flap animation (slower, more natural)
    const mouthOpen = isSpeaking ? Math.floor(frame / 6) % 2 === 0 : false;

    // Gentle bounce when speaking
    const bounceY = isSpeaking
        ? interpolate(Math.sin(frame * 0.2), [-1, 1], [-5, 0])
        : 0;

    // Entrance spring animation
    const entrance = spring({
        frame,
        fps,
        config: {
            damping: 15,
        },
        durationInFrames: 30,
    });

    const slideIn = interpolate(entrance, [0, 1], [isLeft ? -300 : 300, 0]);

    // Scale effect when speaking to emphasize active character
    const scale = isSpeaking ? 1.05 : 1.0;

    const imagePath = `images/${characterId}/${mouthOpen ? "mouth_open" : "mouth_close"}.png`;

    return (
        <div
            className={`absolute bottom-0 w-[500px] h-[600px] flex items-end justify-center transition-all duration-300`}
            style={{
                [config.position]: 50, // basic offset
                transform: `translateX(${slideIn}px) translateY(${bounceY}px) scale(${scale})`,
                transition: "transform 0.2s ease-out",
                opacity: interpolate(entrance, [0, 0.5], [0, 1]),
            }}
        >
            <Img
                src={staticFile(imagePath)}
                className="h-full object-contain filter drop-shadow-2xl"
                style={{
                    filter: isSpeaking ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))" : "drop-shadow(0 0 5px rgba(0,0,0,0.5))"
                }}
            />
        </div>
    );
};
