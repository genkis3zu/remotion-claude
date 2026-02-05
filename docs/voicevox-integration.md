# VoiceVox Integration

This project integrates VoiceVox to generate audio and subtitles automatically from a text script.

## Core Component: `script.ts`

The single source of truth for the video's content is `src/data/script.ts`.
This TypeScript file exports a `scriptData` array where each item represents a line of dialogue.

### Script Data Structure

```typescript
interface ScriptLine {
  id: number;
  character: "zundamon" | "metan" | "tsumugi";
  text: string;           // Text for VoiceVox generation (can include pronunciation tweaks)
  displayText?: string;   // Optional: Text to display as subtitle (if different from audio text)
  voiceFile: string;      // Filename for the generated audio (e.g., "001_zundamon.mp3")
  durationInFrames: number; // Calculated duration of the audio + padding
  pauseAfter: number;     // Silence frames after the line
}
```

## Audio Generation Workflow

1. **Edit Script**: Modify `src/data/script.ts` with your dialogue.
2. **Generate Audio**: Run the generation script (usually `npm run generate:audio` or similar, invoking `scripts/generate-voices.mjs`).
3. **VoiceVox Engine**: The script sends requests to a locally running VoiceVox engine (default port `50021`).
    - *Note: Ensure VoiceVox is running before generating.*

## Subtitle Synchronization

Remotion uses the `durationInFrames` property to time the subtitles and character lip-sync.
The `voicevox-template` logic handles the mapping between the current frame and the active script line to display the correct text and mouth shape.

## Adding New Characters

To add a new character:

1. Define them in `CHARACTER_CONFIG` in `src/data/script.ts`.
2. Assign a `speakerId` corresponding to the VoiceVox character ID.
3. Ensure corresponding character assets exist in `public/characters/{id}/`.
