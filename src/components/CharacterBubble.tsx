import React from 'react';
import { Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { CharacterId } from '../data/script';
import { BUBBLE_PATHS } from '../data/bubblePaths';

interface CharacterBubbleProps {
    characterId: CharacterId;
    children: React.ReactNode;
    isSpeaking: boolean;
    scale?: number;
    emotion?: string;
    bubbleFlipped?: boolean;
    clipPathData?: string; // SVG path data (0..1 range)
    debug?: boolean;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
    characterId,
    children,
    isSpeaking,
    scale = 1.0,
    emotion = 'normal',
    bubbleFlipped = false,
    clipPathData,
    debug = false
}) => {
    const frame = useCurrentFrame();

    // Floating animation
    const floatY = interpolate(Math.sin(frame * 0.05), [-1, 1], [-10, 10]);

    // Resource Logic
    const getBubbleConfig = () => {
        const baseEmotion = ['normal', 'angry', 'happy', 'sad', 'surprised'].includes(emotion) ? emotion : 'normal';

        let src = '';
        let filter = 'none';

        if (characterId === 'zundamon') {
            src = `assets/frames/bubble_green_${baseEmotion}.png`;
        } else if (characterId === 'metan') {
            src = `assets/frames/bubble_pink_${baseEmotion}.png`;
        } else if (characterId === 'tsumugi') {
            src = `assets/frames/bubble_yellow_${baseEmotion}.png`;
        } else {
            src = `assets/frames/bubble_green_normal.png`;
        }

        return { src, filter };
    };

    // Per-character layout adjustments to handle different asset framing/sizes
    const getCharacterLayout = () => {
        switch (characterId) {
            case 'zundamon':
                return { scale: 1.15, translateY: 35 }; // Reduce scale to match others visually
            case 'metan':
                return { scale: 1.25, translateY: 45 }; // Same scale, lower position to clear head
            case 'tsumugi':
                return { scale: 1.25, translateY: 45 }; // Same scale, lower position to clear head
            default:
                return { scale: 1.25, translateY: 35 };
        }
    };

    const { scale: charScale, translateY } = getCharacterLayout();
    const { src, filter } = getBubbleConfig();

    // SVG Clip Path Implementation
    const clipId = `bubble-clip-${characterId}`;

    // Import path data or use default
    // Note: BUBBLE_PATHS normalized to 0..1
    const defaultPath = BUBBLE_PATHS[characterId] || BUBBLE_PATHS['default'];
    const pathData = clipPathData || defaultPath;

    return (
        <div style={{
            position: 'relative',
            width: 800 * scale,
            height: 700 * scale,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translateY(${floatY}px)`
        }}>
            {/* SVG Definition for Mask */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                        <path d={pathData} />
                    </clipPath>
                </defs>
            </svg>

            {/* Debug Overlay: Shows the mask shape in semi-transparent RED */}
            {/* Correction for Debug Overlay:
               The <path> inside <clipPath> with `clipPathUnits="objectBoundingBox"` works automatically for the mask.
               But for a visible <path> to debug, we need to map 0..1 to the SVG size (800x700).
               It's easier to use a separate SVG with viewBox="0 0 1 1" for the debug overlay.
            */}
            {debug && (
                <svg
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                >
                    <path d={pathData} fill="rgba(255, 0, 0, 0.5)" stroke="red" vectorEffect="non-scaling-stroke" strokeWidth="0.005" />
                </svg>
            )}

            {/* Matte & Content Layer */}
            {/* Now fully managed by clipPath - container fills the frame area 100% */}
            {/* The SVG path creates the inset and shape. */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: debug ? 'rgba(0, 0, 255, 0.3)' : 'transparent',
                clipPath: `url(#${clipId})`,
                zIndex: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}>
                {/* Character Anchor */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    // Changed to bottom-center scaling to prevent feet from moving down when scaling up
                    // This ensures "bust up" logic holds: bottom stays at bottom, head goes up.
                    // We translate Y positive to push the legs down out of the mask, keeping the upper body.
                    // Now using per-character values.
                    transform: `scale(${charScale}) translateY(${translateY}%)`,
                    transformOrigin: 'bottom center',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                    }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Bubble Frame Layer */}
            <Img
                src={staticFile(src)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    filter: filter,
                    zIndex: 1,
                    objectFit: 'contain',
                    transform: bubbleFlipped ? 'scaleX(-1)' : undefined
                }}
            />
        </div>
    );
};
