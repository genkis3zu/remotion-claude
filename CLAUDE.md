# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a **Remotion video project** monorepo:

```
remotion-claude/
├── .guardrails/         # AI agent guidelines and project rules
├── .agents/             # AI skills (Remotion best practices)
├── testvideo/           # Main Remotion project
│   ├── src/             # Video compositions and components
│   ├── package.json     # Dependencies
│   └── remotion.config.ts
└── CLAUDE.md            # This file
```

## Commands

All commands should be run from the `testvideo/` directory:

```bash
cd testvideo
npm run dev          # Start Remotion Studio preview
npm run build        # Bundle the project
npm run lint         # ESLint + TypeScript check
npx remotion render  # Render video (add composition id for specific)
npx remotion render HelloWorld out/video.mp4  # Render specific composition
npx remotion upgrade # Upgrade Remotion packages
```

## Tech Stack

- **Remotion** 4.0.409 - React-based video creation
- **React** 19.2.3 with TypeScript 5.9
- **TailwindCSS v4** via `@remotion/tailwind-v4`
- **Zod** for props validation

## Critical Animation Rules

**ALL animations MUST use Remotion's frame-based system:**

```tsx
// CORRECT - Use useCurrentFrame()
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);

// FORBIDDEN - CSS transitions/animations
// CSS: transition, animation, @keyframes
// Tailwind: animate-*, transition-*
```

**Why?** Remotion renders each frame independently. CSS animations don't know what frame they're on, causing incorrect renders.

## Key References

- **Project Rules**: `.guardrails/` - AI agent guidelines, checklists, architecture docs
- **Remotion Skills**: `.agents/skills/remotion-best-practices/rules/` - Domain-specific patterns for:
  - `animations.md` - Frame-based animation patterns
  - `sequencing.md` - Sequence and Series timing
  - `compositions.md` - Composition setup and metadata
  - `timing.md` - Interpolation curves and spring animations
  - `videos.md`, `audio.md`, `images.md` - Media embedding
  - `tailwind.md` - TailwindCSS integration specifics

## Architecture Overview

**Entry Point Flow:**
1. `src/index.ts` → calls `registerRoot()` with `RemotionRoot`
2. `src/Root.tsx` → defines all `<Composition>` entries
3. Each composition references a React component for video content

**Component Pattern:**
```tsx
// Compositions use Zod schemas for type-safe, parametrized rendering
<Composition
  id="HelloWorld"
  component={HelloWorld}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  schema={myCompSchema}
  defaultProps={{...}}
/>
```

## Verification

Before completing any task:
1. Run `npm run lint` in `testvideo/`
2. Start Remotion Studio with `npm run dev` to verify compositions render
3. Check animations use `useCurrentFrame()`, not CSS
