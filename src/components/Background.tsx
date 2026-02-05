import { AbsoluteFill } from "remotion";
import React from "react";

export const Background: React.FC = () => {
  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
    </AbsoluteFill>
  );
};
