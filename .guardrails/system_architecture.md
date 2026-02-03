# System Architecture (v1.0)

## Overview
本プロジェクト「Remotion Video Creation」のシステムアーキテクチャを定義する。

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Video Framework | Remotion | 4.0.409 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.9.3 |
| Styling | TailwindCSS v4 | 4.0.0 |
| Props Validation | Zod | 3.22.3 |
| Linting | ESLint | 9.19.0 |

---

## Directory Structure

```
remotion-claude/
├── .guardrails/              # AI agent guidelines
│   ├── system_architecture.md  # This file
│   ├── ui_architecture.md      # Component patterns
│   ├── claude_meta.md          # ClaudeCode rules
│   ├── checklist.md            # Quality checklist
│   └── ...
├── .agents/                  # AI skills
│   └── skills/
│       └── remotion-best-practices/
│           └── rules/        # Domain-specific patterns
├── testvideo/                # Main Remotion project
│   ├── src/
│   │   ├── index.ts          # Entry point (registerRoot)
│   │   ├── Root.tsx          # Composition registry
│   │   ├── HelloWorld.tsx    # Main composition
│   │   └── HelloWorld/       # Component modules
│   │       ├── Arc.tsx
│   │       ├── Atom.tsx
│   │       ├── Logo.tsx
│   │       ├── Rings.tsx
│   │       ├── Subtitle.tsx
│   │       └── Title.tsx
│   ├── public/               # Static assets
│   ├── package.json
│   ├── remotion.config.ts    # Remotion CLI config
│   ├── tsconfig.json
│   └── eslint.config.mjs
├── CLAUDE.md                 # Root Claude Code instructions
└── .gitignore
```

---

## Build Pipeline

### Development
```bash
npm run dev  # Remotion Studio preview (http://localhost:3000)
```

### Production Build
```bash
npm run build  # Bundle for production
```

### Video Rendering
```bash
npx remotion render                          # Interactive composition selection
npx remotion render HelloWorld out/video.mp4 # Specific composition
npx remotion render HelloWorld --props='{"titleText":"Custom"}'  # With props
```

---

## Entry Point Flow

```
src/index.ts
    │
    ▼ registerRoot()
src/Root.tsx (RemotionRoot)
    │
    ▼ <Composition>
src/HelloWorld.tsx
    │
    ▼ Component tree
src/HelloWorld/*.tsx (Arc, Atom, Logo, etc.)
```

---

## Composition Registry

`Root.tsx` defines all available compositions:

```tsx
export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      {/* Additional compositions */}
    </>
  );
};
```

---

## Quality Gates

| Gate | Command | Requirement |
|------|---------|-------------|
| TypeScript | `npm run lint` (includes tsc) | 0 errors |
| ESLint | `npm run lint` | 0 errors |
| Studio | `npm run dev` | Renders without errors |
| Render | `npx remotion render` | Completes successfully |

---

## Key Files

| File | Purpose |
|------|---------|
| `remotion.config.ts` | Remotion CLI configuration (webpack, video format) |
| `src/Root.tsx` | Composition registry with props schemas |
| `src/HelloWorld.tsx` | Example composition with Zod schema |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.mjs` | ESLint with Remotion flat config |
