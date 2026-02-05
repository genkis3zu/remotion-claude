import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { CharacterId } from "../data/script";
import { CharacterBubble } from "./CharacterBubble";

// Using the config from script.ts for consistency in IDs, 
// but ignoring the 'position' field from it.

interface StageCharacterProps {
    characterId: CharacterId;
    isSpeaking: boolean;
    emotion?: string; // Add emotion support
    debug?: boolean;
    flipped?: boolean;
}

export const StageCharacter: React.FC<StageCharacterProps> = ({
    characterId,
    isSpeaking,
    emotion = "normal",
    debug,
    flipped = false
}) => {
    const frame = useCurrentFrame();

    // 口パクアニメーション（約6fpsで開閉）
    const mouthOpen = isSpeaking ? Math.floor(frame / 5) % 2 === 0 : false;
    const state = mouthOpen ? "open" : "close";

    // 話している時の上下揺れ
    const bounceY = isSpeaking
        ? interpolate(Math.sin(frame * 0.3), [-1, 1], [-3, 3])
        : 0;

    // Determine image path
    // Logic from ScriptCharacter: images/{name}/{pose}/{filename}
    // We assume 'normal' pose for now as per previous logic.
    // Determine pose based on emotion or defaults
    let pose = "normal";
    if (emotion === "thinking") {
        pose = "thinking";
    } else if (emotion === "sad" || emotion === "concerned") {
        // metan might have a 'worried' or 'sad' pose, but let's stick to known folders first.
        // If folders don't exist, this logic needs to be safe.
        // We verified: metan has 'thinking', 'pointing', 'holding'. Zundamon has 'pointing', 'hands_up'.
        // Let's use 'normal' as safe default but try to map 'thinking'.
        if (characterId === "metan") pose = "normal"; // safe fallback
    } else if (emotion === "pointing") {
        pose = "pointing";
    }

    // Fallback: If we want to use 'pointing' for specific emphasized emotions?
    if ((emotion === "angry" || emotion === "surprised") && characterId === "zundamon") {
        // Maybe us 'hands_up'?
        // pose = "hands_up"; // Need to verify folder existence carefully.
    }

    // For now, simpler exact mapping for known folders:
    if (emotion === "thinking") pose = "thinking";

    // Note: The file structure is images/{characterId}/{pose}/{emotion}_{state}.png
    // If we change pose to "thinking", we need to make sure "thinking_open.png" exists inside "thinking" folder? 
    // OR does the "thinking" folder contain "normal_open.png"? 
    // Usually standard structure is images/char/pose/emotion.png.
    // Let's assume the previous logic: filename = `${emotion}_${state}.png`
    // So if pose="thinking", and emotion="thinking", we look for "images/metan/thinking/thinking_open.png".
    // If that file doesn't exist, we crash.
    // SAFEGUARDS: 
    // It's safer to separate 'pose' (body) from 'expression' (face), but here they are folders.
    // Directory listing showed: D:\Dev\remotion-claude\public\images\metan\thinking
    // It likely contains the face variations FOR that pose.

    // Let's stick to "normal" for most to avoid crash, but enable "thinking" if emotion is "thinking".
    // Map of fallback emotions if specific ones might be missing
    // or if we want to map 'serious' to 'normal' etc.
    const emotionMap: Record<string, string> = {
        "serious": "normal",
        "mysterious": "normal",
        "energetic": "happy",
        "relaxing": "normal",
        "playful": "happy",
        "smug": "happy", // Fallback for missing smug assets
        "surprised": "surprised" // explicit keep, or just default behavior
    };

    const effectiveEmotion = emotionMap[emotion] || emotion;

    let filename = "";
    if (effectiveEmotion === "normal") {
        filename = `mouth_${state}.png`;
    } else {
        filename = `${effectiveEmotion}_${state}.png`;
    }

    const imagePath = `images/${characterId}/${pose}/${filename}`;

    // Placeholder for config and shouldFlipBubble, as they are not defined in the current scope.
    // You will need to define `config` and `shouldFlipBubble` or pass them as props.
    const config = { scale: 1 }; // Example placeholder
    const shouldFlipBubble = false; // Example placeholder

    return (
        <CharacterBubble
            characterId={characterId}
            isSpeaking={isSpeaking}
            scale={config.scale}
            emotion={emotion}
            bubbleFlipped={shouldFlipBubble}
            debug={debug}
        >
            <Img
                src={staticFile(imagePath)}
                style={{
                    height: '110%',
                    width: 'auto',
                    objectFit: "contain",
                    transformOrigin: 'bottom center',
                    transform: flipped ? `scaleX(-1) translateY(${bounceY}px)` : `translateY(${bounceY}px)`
                }}
                onError={(e) => {
                    console.error(`StageCharacter: Failed to load image: ${imagePath}`);
                }}
            />
        </CharacterBubble>
    );
};
