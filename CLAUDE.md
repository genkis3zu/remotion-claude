# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Remotion Studio preview
npm run build        # Bundle the project
npm run lint         # ESLint + TypeScript check
npx remotion render  # Render video (add composition id for specific)
npx remotion render HelloWorld out/video.mp4  # Render specific composition
npx remotion upgrade # Upgrade Remotion packages
```

## Architecture

This is a Remotion video project using React 19 and TypeScript.

**Entry Point Flow:**
- `src/index.ts` → calls `registerRoot()` with `RemotionRoot`
- `src/Root.tsx` → defines all `<Composition>` entries (each appears in Studio sidebar)
- Each composition references a React component that renders the video content

**Key Files:**
- `remotion.config.ts` - Remotion CLI configuration (video format, webpack overrides)
- `src/Root.tsx` - Composition registry with props schemas
- `src/HelloWorld.tsx` - Example composition with Zod schema for typed props

**Component Pattern:**
Compositions use Zod schemas (`myCompSchema`) for type-safe, parametrized rendering. Props are defined with `z.object()` and colors use `zColor()` from `@remotion/zod-types`.

## Remotion-Specific Rules

**Animation Requirements:**
- ALL animations MUST use `useCurrentFrame()` hook - CSS transitions/animations are forbidden
- Tailwind animation classes are forbidden - they won't render correctly
- Use `interpolate()` and `spring()` for all motion
- Express timing in seconds, multiply by `fps` from `useVideoConfig()`

**Sequencing:**
- Use `<Sequence from={frame}>` to delay element appearance
- Always add `premountFor` prop to preload components
- `useCurrentFrame()` inside a Sequence returns local frame (0-based), not global

**Composition Structure:**
- Each `<Composition>` needs: `id`, `component`, `durationInFrames`, `fps`, `width`, `height`
- Use `schema` + `defaultProps` for parametrized videos
- Use `<Folder>` to organize compositions in the sidebar

## Tech Stack

- Remotion 4.0.409
- React 19 with TypeScript
- TailwindCSS v4 (via `@remotion/tailwind-v4`)
- Zod for props validation
- ESLint with `@remotion/eslint-config-flat`

## Skills Reference

Domain-specific guidance is available in `.claude/skills/remotion-best-practices/rules/` covering:
- `animations.md` - Frame-based animation patterns
- `sequencing.md` - Sequence and Series timing
- `compositions.md` - Composition setup and metadata
- `timing.md` - Interpolation curves and spring animations
- `videos.md`, `audio.md`, `images.md` - Media embedding
- `tailwind.md` - TailwindCSS integration specifics
