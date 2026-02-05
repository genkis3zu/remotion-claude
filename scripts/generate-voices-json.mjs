#!/usr/bin/env node
/**
 * VOICEVOX Audio Generator (JSON version)
 * Reads src/data/currentScript.json and generates numbered WAV files in public/voice/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'voice');
const SCRIPT_PATH = path.join(ROOT_DIR, 'src', 'data', 'currentScript.json');
const VOICEVOX_HOST = 'http://localhost:50021';

// Speaker Map
// Verify speaker IDs! Zundamon=3 (Normal), Metan=2 (Normal), Tsumugi=8 (Normal)
const SPEAKERS = {
    zundamon: 3,
    metan: 2,
    tsumugi: 8
};

async function checkVoicevox() {
    try {
        const res = await fetch(`${VOICEVOX_HOST}/version`);
        if (res.ok) return true;
    } catch (e) {
        console.error('❌ Cannot connect to VOICEVOX. Please start it.');
        return false;
    }
}

async function generateVoice(text, speakerId, outputPath) {
    const queryRes = await fetch(
        `${VOICEVOX_HOST}/audio_query?speaker=${speakerId}&text=${encodeURIComponent(text)}`,
        { method: 'POST' }
    );
    if (!queryRes.ok) throw new Error(`audio_query failed: ${queryRes.statusText}`);
    const query = await queryRes.json();

    const synthRes = await fetch(
        `${VOICEVOX_HOST}/synthesis?speaker=${speakerId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        }
    );
    if (!synthRes.ok) throw new Error(`synthesis failed: ${synthRes.statusText}`);

    const audioBuffer = await synthRes.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

    // Calculate duration if needed, but for now just save content
    // We rely on simple logic.
}

async function main() {
    if (!(await checkVoicevox())) process.exit(1);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const script = JSON.parse(fs.readFileSync(SCRIPT_PATH, 'utf-8'));
    console.log(`Processing ${script.length} lines...`);

    for (let i = 0; i < script.length; i++) {
        const item = script[i];
        const speakerId = SPEAKERS[item.character];
        const filename = `${i.toString().padStart(3, '0')}.wav`;
        const outputPath = path.join(OUTPUT_DIR, filename);

        if (!speakerId) {
            console.warn(`Skipping unknown character: ${item.character}`);
            continue;
        }

        console.log(`[${i}] ${item.character}: ${item.text.substring(0, 20)}...`);
        try {
            await generateVoice(item.text, speakerId, outputPath);
        } catch (e) {
            console.error(`Error generating ${filename}: ${e.message}`);
        }
    }
    console.log("Done!");
}

main().catch(console.error);
