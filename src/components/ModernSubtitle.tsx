import { AbsoluteFill, useVideoConfig, spring, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import React from "react";
import { CharacterId, CHARACTER_CONFIG } from "../data/script";

const { fontFamily } = loadFont();

interface SubtitleProps {
    text: string;
    character: CharacterId;
}

export const ModernSubtitle: React.FC<SubtitleProps> = ({ text, character }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const config = CHARACTER_CONFIG[character];

    const spr = spring({
        frame,
        fps,
        config: {
            damping: 20,
            stiffness: 200,
        },
    });

    const translateY = interpolate(spr, [0, 1], [50, 0]);
    const opacity = interpolate(spr, [0, 1], [0, 1]);

    return (
        <AbsoluteFill className="flex justify-end pb-16 items-center flex-col pointer-events-none">
            <div
                className="relative bg-white/90 backdrop-blur-md px-12 py-6 rounded-3xl border-4 shadow-2xl max-w-[80%]"
                style={{
                    borderColor: config.color,
                    transform: `translateY(${translateY}px)`,
                    opacity,
                    fontFamily,
                    boxShadow: `0 10px 30px -10px ${config.color}80`,
                }}
            >
                {/* Name Badge */}
                <div
                    className="absolute -top-5 left-8 px-4 py-1 rounded-full text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: config.color }}
                >
                    {config.name}
                </div>

                <p className="text-4xl text-gray-900 font-bold leading-relaxed tracking-wide text-center m-0">
                    {text}
                </p>
            </div>
        </AbsoluteFill>
    );
};
