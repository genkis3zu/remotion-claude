# UI Architecture (v1.0)

## Overview
Remotion コンポジションにおける UI / アニメーション設計原則を定義する。

---

## Component Pattern

```
RemotionRoot
    │
    ▼
<Composition>
    │
    ▼
Component (e.g., HelloWorld)
    │
    ├─▶ useCurrentFrame()
    ├─▶ useVideoConfig()
    ├─▶ interpolate() / spring()
    │
    ▼
Child Components (Arc, Logo, Title, etc.)
```

---

## Animation Rules (CRITICAL)

### MUST: Frame-Based Animation

**すべてのアニメーションは `useCurrentFrame()` ベースで実装すること。**

```tsx
// ✅ CORRECT
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Opacity fade-in over 1 second
const opacity = interpolate(
  frame,
  [0, fps],  // 0 to 1 second
  [0, 1],
  { extrapolateRight: 'clamp' }
);

// Spring animation
const scale = spring({
  frame,
  fps,
  config: { damping: 200 }
});
```

### FORBIDDEN: CSS Animations

**CSS アニメーション / Tailwind アニメーションは使用禁止。**

```tsx
// ❌ FORBIDDEN - CSS transitions
style={{ transition: 'opacity 0.5s' }}

// ❌ FORBIDDEN - CSS animations
style={{ animation: 'fadeIn 1s' }}

// ❌ FORBIDDEN - Tailwind animation classes
className="animate-spin"
className="animate-bounce"
className="transition-opacity"
```

### Why?

Remotion は各フレームを独立してレンダリングする。CSS アニメーションは「現在が何フレーム目か」を知らないため、正しくレンダリングされない。

---

## Composition Structure

### Required Props

```tsx
<Composition
  id="HelloWorld"           // Unique identifier
  component={HelloWorld}    // React component
  durationInFrames={150}    // Total frames (150 @ 30fps = 5 seconds)
  fps={30}                  // Frames per second
  width={1920}              // Video width
  height={1080}             // Video height
  schema={myCompSchema}     // Zod schema for props
  defaultProps={{...}}      // Default prop values
/>
```

### Zod Schema Pattern

```tsx
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const myCompSchema = z.object({
  titleText: z.string(),
  titleColor: zColor(),
  logoColor1: zColor(),
  logoColor2: zColor(),
});
```

---

## Sequencing

### Basic Sequence

```tsx
import { Sequence } from 'remotion';

// Element appears at frame 30, lasts 60 frames
<Sequence from={30} durationInFrames={60}>
  <MyComponent />
</Sequence>
```

### Premounting

```tsx
// Preload component 10 frames before appearance
<Sequence from={30} premountFor={10}>
  <HeavyComponent />
</Sequence>
```

### Local vs Global Frame

```tsx
// Inside a Sequence, useCurrentFrame() returns LOCAL frame (0-based)
const frame = useCurrentFrame();
// At global frame 35, if Sequence starts at 30, frame = 5
```

---

## Interpolation Patterns

### Basic Interpolate

```tsx
const value = interpolate(
  frame,
  [0, 30, 60],      // Input range
  [0, 1, 0.5],      // Output range
  { extrapolateRight: 'clamp' }
);
```

### Spring Animation

```tsx
const scale = spring({
  frame,
  fps,
  config: {
    damping: 200,    // Higher = less bouncy
    stiffness: 100,  // Higher = faster
    mass: 1,         // Higher = slower
  }
});
```

### Timing in Seconds

```tsx
const { fps } = useVideoConfig();

// 2 seconds fade-in
const opacity = interpolate(
  frame,
  [0, 2 * fps],
  [0, 1]
);
```

---

## Tailwind Integration

### Allowed

```tsx
// ✅ Static utility classes
className="flex items-center justify-center"
className="text-white text-4xl font-bold"
className="bg-blue-500 rounded-lg p-4"
```

### Forbidden

```tsx
// ❌ Animation utilities
className="animate-pulse"
className="animate-spin"
className="transition-all"
className="duration-300"
```

---

## Component Best Practices

### 1. Separate Animation Logic

```tsx
// ✅ Good - animation logic in hook
function useLogoAnimation(frame: number, fps: number) {
  return {
    opacity: interpolate(frame, [0, fps], [0, 1]),
    scale: spring({ frame, fps, config: { damping: 200 } }),
  };
}

// Component stays clean
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, scale } = useLogoAnimation(frame, fps);
  // ...
};
```

### 2. Use AbsoluteFill for Layers

```tsx
import { AbsoluteFill } from 'remotion';

<AbsoluteFill style={{ backgroundColor: 'black' }}>
  <Logo />
  <Title />
</AbsoluteFill>
```

### 3. Responsive Sizing

```tsx
const { width, height } = useVideoConfig();
const fontSize = width / 20; // Scales with video size
```

---

## Checklist

Before completing any UI work:

- [ ] All animations use `useCurrentFrame()` (not CSS)
- [ ] No Tailwind animation classes (`animate-*`, `transition-*`)
- [ ] Compositions have all required props (`id`, `component`, `durationInFrames`, `fps`, `width`, `height`)
- [ ] Zod schemas validate all dynamic props
- [ ] Sequences use `premountFor` for heavy components
- [ ] Video renders without errors in Remotion Studio
