import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate, spring } from "remotion";

type BentoItem = {
    id: string;
    title: string;
    className?: string;
    content: React.ReactNode;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
};

export const BentoGrid: React.FC<{
    items: BentoItem[];
}> = ({ items }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-full p-8">
            {items.map((item, index) => {
                const delay = index * 5;
                const progress = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 12 },
                });

                const scale = interpolate(progress, [0, 1], [0.8, 1]);
                const opacity = interpolate(progress, [0, 1], [0, 1]);

                return (
                    <div
                        key={item.id}
                        className={`
              relative overflow-hidden rounded-xl bg-white/90 shadow-lg border-2 border-slate-200
              flex flex-col items-center justify-center p-4
              ${item.colSpan === 2 ? "col-span-2" : "col-span-1"}
              ${item.colSpan === 3 ? "col-span-3" : ""}
              ${item.rowSpan === 2 ? "row-span-2" : "row-span-1"}
              ${item.className || ""}
            `}
                        style={{
                            transform: `scale(${scale})`,
                            opacity,
                        }}
                    >
                        <h3 className="text-xl font-bold mb-2 text-slate-700">{item.title}</h3>
                        {item.content}
                    </div>
                );
            })}
        </div>
    );
};
