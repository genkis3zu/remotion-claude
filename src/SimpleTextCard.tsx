import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Props schema for parametrized rendering
export const simpleTextCardSchema = z.object({
  text: z.string(),
  textColor: zColor(),
  backgroundColor: zColor(),
  fontSize: z.number().min(20).max(200),
});

type Props = z.infer<typeof simpleTextCardSchema>;

export const SimpleTextCard: React.FC<Props> = ({
  text,
  textColor,
  backgroundColor,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timing (in frames)
  const fadeInDuration = fps * 0.5;  // 0.5 seconds
  const fadeOutStart = durationInFrames - fps * 0.5;  // Start fade out 0.5s before end

  // Fade in: 0 → 1 over first 0.5 seconds
  const fadeIn = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out: 1 → 0 over last 0.5 seconds
  const fadeOut = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combined opacity
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          color: textColor,
          fontSize,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
