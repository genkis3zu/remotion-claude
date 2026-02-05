
import { AbsoluteFill } from "remotion";
import { TrueFocus } from "./chuk-motion/TrueFocus";
import { Background } from "./Background";

export const HookTitle: React.FC<{
    text: string;
    highlightWords?: string[];
}> = ({ text, highlightWords }) => {
    // Determine configuration based on whether we have specific highlight words
    // If highlightWords are present, we might want to focus ONLY those?
    // Or just run the TrueFocus animation on the whole text.

    // For now, simple implementation wrapping TrueFocus
    // The visual request: "TrueFocus (強調文字) でキーワードを連打"

    return (
        <AbsoluteFill>
            <Background />
            <TrueFocus
                text={text}
                manualMode={false} // Auto animate
                borderColor="#FFD700" // Gold
                blurAmount={6}
                animationDuration={0.8}
            />
        </AbsoluteFill>
    );
};
