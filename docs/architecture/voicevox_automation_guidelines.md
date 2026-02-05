# Voicevox & Remotion Integration Guidelines

This document outlines the critical "pitfalls" and best practices for integrating Voicevox (audio synthesis) and Remotion (programmatic video), specifically when automating with AI agents.

## 1. Separation of Generation and Rendering (CRITICAL)

**Rule:** NEVER call the Voicevox API directly inside a Remotion React component during rendering.

* **Reason:** Remotion rendering must be **deterministic**.
  * API calls during render cause unstable generation times.
  * Leads to timeouts and hydration errors (server/client mismatch).
  * Risk of hitting API rate limits.
* **Solution: The 2-Stage Process**
    1. **Pre-computation:** Use a script (Python/Node.js) to call Voicevox API, generate `.wav` files, save them to `public/`, and calculate their exact duration.
    2. **Rendering:** Pass the file paths and duration data (as JSON/TypeScript) to Remotion. Use `<Audio />` tags to load the pre-generated files.

## 2. Synchronization of Frames and Audio Duration

Voicevox audio length varies by text. Remotion manages time in **Frames**.

* **Problem:** Mismatch causes scenes to cut early or have awkward silence.
* **Solution:** Calculate frames based on precise audio duration during the pre-computation step.
  * **Formula:** `durationInFrames = Math.ceil(audioDurationInSeconds * fps)`
  * **Agent Instruction:** "Measure precise duration using `pydub` or `ffprobe` when generating audio, and write it to `script.json` (or `script.ts`) as `durationInFrames`."

## 3. Asset Placement and `staticFile()`

* **Rule:** Generated audio files must be placed in `public/` and referenced using `staticFile()`.
* **Reason:** Absolute paths (e.g., `C:/Users/...`) work locally but FAIL in browser previews and Remotion Lambda (cloud rendering).
* **Example:**

    ```tsx
    import { staticFile } from 'remotion';
    // Correct
    <Audio src={staticFile("voices/001.wav")} />
    ```

## 4. Docker and Cloud/Lambda Networking

* **Scenario:** Moving from local Docker Voicevox to AWS Lambda rendering.
* **Problem:** AWS Lambda cannot access your local PC's Docker container (`localhost:50021`).
* **Solutions:**
  * **Pattern A (Recommended):** Generate ALL audio locally before rendering. Upload audio files as assets to Lambda along with the code. (Watch for bundle size limits).
  * **Pattern B:** Deploy Voicevox engine to a public cloud (EC2/GPU instance) and access via global IP (Requires allowing non-deterministic API calls or pre-fetching). *Pattern A is preferred for stability.*

## 5. Character Lip-Sync (Lip-flaps)

* **Challenge:** Full vowel-based lip-sync is complex in Remotion.
* **Simplified Solution:**
  * Use `useAudioData()` hook to detect volume/amplitude.
  * Animate (bounce/scale) the character image or toggle between "Open/Closed" mouth images based on volume threshold.
  * This provides a sufficient "talking" effect without complex phoneme mapping.

## 6. Instructions for AI Agents (Antigravity)

When instructing an AI to write code for this system, explicitly state:

* "Perform audio generation in a separate script (Python/Node) and complete it BEFORE starting Remotion rendering."
* "Name audio files sequentially (e.g., `001.wav`) and ensure consistency with the JSON data."
* "Do NOT use `useEffect` for data fetching inside React components (Remotion anti-pattern)."

---

*This document matches the architectural constraints required for stable and automated video production.*
