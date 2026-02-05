import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Character as CharacterType, Emotion } from "../types";

interface ScriptCharacterProps {
    name: CharacterType;
    emotion: Emotion;
    isTalking: boolean;
}

export const ScriptCharacter: React.FC<ScriptCharacterProps> = ({
    name,
    emotion,
    isTalking,
}) => {
    const frame = useCurrentFrame();

    // Character configuration (position, etc.)
    // zundamon: left, metan: right, tsumugi: right (or left? let's assume right for now or define config)
    // We can hardcode or move this config to types or a separate config file.
    // Using simple hardcoded config for now matching user intent logic.
    const config = {
        zundamon: { position: "left", offset: -200 },
        metan: { position: "right", offset: 200 },
        tsumugi: { position: "right", offset: 200 },
    }[name];

    const isLeft = config.position === "left";

    // 口パクアニメーション（約6fpsで開閉）
    // Talking means moving mouth. If not talking, mouth is closed using "mouth_close" (or emotion_close)
    const mouthOpen = isTalking ? Math.floor(frame / 5) % 2 === 0 : false;
    const state = mouthOpen ? "open" : "close";

    // 話している時の上下揺れ
    const bounceY = isTalking
        ? interpolate(Math.sin(frame * 0.3), [-1, 1], [-3, 3])
        : 0;

    // 登場アニメーション (Simple slide in)
    // Start from offset (e.g. -200) to 0. 
    // Let's assume the character is always visible but maybe we want specific entrance?
    // User snippet didn't show entrance logic, existing Character.tsx did.
    // I will keep the slide info from frame 0-15.
    const slideIn = interpolate(frame, [0, 15], [isLeft ? -200 : 200, 0], {
        extrapolateRight: "clamp",
    });

    // Construct image path based on generate-expressions.py logic
    // Path: images/{name}/normal/{filename}
    // Filename: if emotion == "normal" -> mouth_{state}.png
    //           else -> {emotion}_{state}.png

    let pose = "normal";
    let filename = "";

    if (emotion === "smug") {
        if (name === "zundamon") {
            pose = "confident";
            // Confident pose default face is the "smug" look
            filename = `mouth_${state}.png`;
        } else {
            // Fallback for character without confident pose
            filename = `happy_${state}.png`;
        }
    } else if (emotion === "normal") {
        filename = `mouth_${state}.png`;
    } else {
        filename = `${emotion}_${state}.png`;
    }

    const imagePath = `images/${name}/${pose}/${filename}`;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                [config.position]: slideIn, // dynamically set left or right
                transform: `translateY(${bounceY}px)`,
                // Fixed width container to position character? 
                // Existing Character.tsx used [config.position] style property directly.
            }}
        >
            <Img
                src={staticFile(imagePath)}
                style={{
                    height: 500, // Adjusted height, existing was 400
                    objectFit: "contain",
                }}
                onError={(e) => {
                    console.error(`Failed to load image: ${imagePath}`);
                }}
            />
        </div>
    );
};
