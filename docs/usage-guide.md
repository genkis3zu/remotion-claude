# Usage Guide

How to set up the project, generate assets, and render videos.

## Prerequisites

- **Node.js**: v18+
- **Python**: 3.8+ (for asset generation)
- **VoiceVox Engine**: Must be installed and running locally.
- **FFmpeg**: Required by Remotion.

## 1. Setup

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (if needed for asset generation)
# pip install -r requirements.txt (if available) or install psd-tools, numpy, opencv-python
```

## 2. Start VoiceVox

Launch your local VoiceVox application. It usually runs on port `50021`.
*Note: The project expects VoiceVox to be reachable at `http://localhost:50021`.*

## 3. Development Workflow

### Start Preview

To open the Remotion Studio and preview your video:

```bash
npm run dev
```

The studio will be available at `http://localhost:3000`.

### Generating Audio

If you have updated `src/data/script.ts`, you need to regenerate the audio files:

```bash
npm run generate:audio
# OR if using a specific script
node scripts/generate-voices.mjs
```

## 4. Rendering

To render the final video to an MP4 file:

```bash
npx remotion render Root out/video.mp4
```

- `Root`: The composition ID (defined in `src/Root.tsx`).
- `out/video.mp4`: The output path.

## 5. Asset Generation (Advanced)

If you need to update the character visuals from PSDs:

1. Place your PSD files in `.assets/` (or configured location).
2. Run the generation script:

    ```bash
    python scripts/generate-expressions.py
    ```

3. New assets will be output to `public/characters/`.

## Troubleshooting

- **Audio not playing?** Check if VoiceVox is running and if `npm run generate:audio` completed successfully.
- **Images missing?** Verify `public/characters/` has the expected files.
- **Render fails?** Ensure FFmpeg is installed and accessible in your PATH.
