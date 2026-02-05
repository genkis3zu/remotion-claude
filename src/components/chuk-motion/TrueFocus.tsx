import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";


export const TrueFocus: React.FC<{
    text: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    animationDuration?: number;
    focusIndex?: number;
}> = ({
    text,
    manualMode = false,
    blurAmount = 5,
    borderColor = 'yellow', // User requested yellow default in example
    animationDuration = 0.5,
    focusIndex = 0
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        // Split text: if it contains spaces, split by space. Otherwise split by character for Japanese.
        const hasSpaces = text.includes(" ");
        const segments = hasSpaces ? text.split(" ") : text.split("");

        // If manualMode is false, auto-cycle focus based on time?
        // User said "TrueFocus ... でキーワードを連打".
        // For now, let's keep it simple: if manualMode is false, we iterate through segments over time.

        // Calculate current focus index based on time if manualMode is false
        const autoFocusIndex = manualMode
            ? focusIndex
            : Math.floor(frame / (fps * (animationDuration / segments.length)));

        // Safety check
        const safeIndex = Math.min(autoFocusIndex, segments.length - 1);

        const currentIndex = manualMode ? focusIndex : safeIndex;

        return (
            <div className="flex flex-wrap justify-center items-center gap-2 p-12 w-full h-full content-center">
                {segments.map((segment, index) => {
                    const isFocused = index === currentIndex;

                    // Animation
                    const entrance = spring({
                        frame: frame - index * 2, // stagger entrance
                        fps,
                        config: { damping: 12 }
                    });

                    // Focus transition
                    // When focused, scale up and remove blur.
                    // When not focused, blur and scale down/opacity.

                    const currentBlur = isFocused ? 0 : blurAmount;
                    const currentOpacity = isFocused ? 1 : 0.3;
                    const currentScale = isFocused ? 1.5 : 1.0;

                    // Text color
                    const textColor = isFocused ? borderColor : 'white';

                    return (
                        <span
                            key={index}
                            className="font-black transition-all duration-300"
                            style={{
                                fontSize: hasSpaces ? '4rem' : '6rem', // Larger for chars
                                filter: `blur(${currentBlur}px)`,
                                opacity: currentOpacity * entrance,
                                transform: `scale(${currentScale})`,
                                color: textColor,
                                textShadow: isFocused ? `0 0 20px ${borderColor}` : 'none'
                            }}
                        >
                            {segment}
                        </span>
                    );
                })}
            </div>
        );
    };
