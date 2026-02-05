import { AbsoluteFill, Img, staticFile } from "remotion";
import React from "react";

export const SplitScreen: React.FC<{
    imageUrl?: string;
    children?: React.ReactNode;
}> = ({ imageUrl, children }) => {
    return (
        <AbsoluteFill className="flex flex-row bg-white">
            <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center bg-slate-100">
                {imageUrl ? (
                    <Img
                        src={staticFile(imageUrl)}
                        className="object-cover w-full h-full"
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <div className="text-slate-400 text-4xl font-bold">No Image</div>
                )}
            </div>
            <div className="w-1/2 h-full relative p-8 flex flex-col items-center justify-center">
                {children}
            </div>
        </AbsoluteFill>
    );
};
