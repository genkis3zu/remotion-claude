import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StaggerText: React.FC<{
    text: string;
    className?: string;
    staggerTime?: number; // Frames between each letter
    type?: "letter" | "word";
}> = ({ text, className = "", staggerTime = 2, type = "letter" }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const items = type === "word" ? text.split(" ") : text.split("");

    return (
        <div className={`flex flex-wrap ${className}`}>
            {items.map((item, index) => {
                const delay = index * staggerTime;
                const progress = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 15, stiffness: 200 },
                });

                const translateY = interpolate(progress, [0, 1], [20, 0]);
                const opacity = interpolate(progress, [0, 1], [0, 1]);

                return (
                    <span
                        key={index}
                        style={{
                            opacity,
                            transform: `translateY(${translateY}px)`,
                            display: "inline-block",
                            marginRight: type === "word" ? "0.25em" : "0",
                        }}
                    >
                        {item}
                    </span>
                );
            })}
        </div>
    );
};
