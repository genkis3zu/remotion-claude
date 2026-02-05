# Project Overview

This project is a video generation platform combining **Remotion** for video rendering and **VoiceVox** for character voice synthesis. It is designed to automate the creation of "explanation" style videos (Kaisetsu videos) featuring characters like Zundamon, Metan, and Tsumugi.

## Technology Stack

- **Core Framework**: Remotion 4.0 (React 19 + TypeScript)
- **Styling**: TailwindCSS v4
- **Voice Synthesis**: VoiceVox (via local engine)
- **Asset Pipeline**: Python scripts for PSD processing and asset generation
- **Validation**: Zod for component props

## Key Features

1. **Automated Voice & Subtitles**:
    - Scripts defined in `src/data/script.ts` are automatically converted to audio files and synchronized subtitles.
    - Support for multiple characters (Zundamon, Metan, Tsumugi) with unique colors and positioning.

2. **Dynamic Character Assets**:
    - Character visuals are generated from PSD files using Python scripts.
    - Support for various expressions (Joy, Anger, Sorrow, etc.) and mouth shapes synchronized with audio (lip-sync).

3. **Modern Architecture**:
    - Component-based video composition.
    - Type-safe configuration using Zod schemas.

## Directory Structure

- `src/`
  - `components/`: React components for video elements (Characters, Backgrounds, etc.).
  - `data/`: Contains `script.ts`, the single source of truth for video dialogue.
  - `voicevox-template/`: Logic and hooks for integrating VoiceVox audio.
- `scripts/`: Python and Node.js scripts for asset generation, audio synthesis, and project maintenance.
- `public/`: Generated assets (images, audio) served to Remotion.
- `docs/`: Project documentation.
