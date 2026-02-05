import React from "react";

export const ProgressBar: React.FC<{
    progress: number; // 0 to 1
    segments?: number; // Visual dividers
    color?: string;
}> = ({ progress, segments = 0, color = "#3B82F6" }) => {
    return (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-200">
            <div
                style={{
                    width: `${Math.min(100, Math.max(0, progress * 100))}%`,
                    backgroundColor: color,
                }}
                className="h-full transition-all duration-200 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />

            {/* Chapter Markers */}
            {segments > 0 && Array.from({ length: segments - 1 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute top-0 h-full w-[2px] bg-white mix-blend-overlay"
                    style={{ left: `${((i + 1) / segments) * 100}%` }}
                />
            ))}
        </div>
    );
};
