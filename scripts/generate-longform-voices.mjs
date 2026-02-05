#!/usr/bin/env node
/**
 * VOICEVOX Audio Generator (Long Form Version)
 * Reads src/data/full_script.json (preferred) or src/data/chapter*.json
 * Generates named WAV files in public/voice/
 * Naming convention: {chapter.title}_{index}.wav
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'voice');
// Directory where chapters are stored
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const VOICEVOX_HOST = 'http://localhost:50021';

// Speaker Map
// Verify speaker IDs! Zundamon=3, Metan=2, Tsumugi=8
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
    // Audio Query
    const queryRes = await fetch(
        `${VOICEVOX_HOST}/audio_query?speaker=${speakerId}&text=${encodeURIComponent(text)}`,
        { method: 'POST' }
    );
    if (!queryRes.ok) throw new Error(`audio_query failed: ${queryRes.statusText}`);
    const query = await queryRes.json();

    // Synthesis
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
}

async function main() {
    if (!(await checkVoicevox())) process.exit(1);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    if (!fs.existsSync(DATA_DIR)) {
        console.warn('src/data directory not found.');
        process.exit(1);
    }

    let chapters = [];

    // Check for full_script.json
    const fullScriptPath = path.join(DATA_DIR, 'full_script.json');
    if (fs.existsSync(fullScriptPath)) {
        console.log(`Found full_script.json. Using it.`);
        const content = JSON.parse(fs.readFileSync(fullScriptPath, 'utf-8'));
        if (Array.isArray(content)) {
            chapters = content;
        } else {
            console.warn('full_script.json is not an array. Falling back to individual files.');
        }
    }

    // Fallback to chapter*.json if full_script didn't yield chapters
    if (chapters.length === 0) {
        const allFiles = fs.readdirSync(DATA_DIR);
        const files = allFiles
            .filter(f => f.startsWith('chapter') && f.endsWith('.json'))
            .map(f => path.join(DATA_DIR, f));

        if (files.length === 0) {
            console.warn('No chapter*.json or full_script.json found in src/data/');
            process.exit(0);
        }
        console.log(`Found ${files.length} individual chapter files.`);

        for (const file of files) {
            const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
            if (content.title && Array.isArray(content.items)) {
                chapters.push(content);
            }
        }
    }

    console.log(`Processing ${chapters.length} chapters.`);

    for (const chapter of chapters) {
        const chapterTitle = chapter.title;
        console.log(`Chapter: ${chapterTitle}, Items: ${chapter.items.length}`);

        for (let i = 0; i < chapter.items.length; i++) {
            const item = chapter.items[i];
            const speakerId = SPEAKERS[item.character];

            // Output filename: {chapterTitle}_{index}.wav
            const filename = `${chapterTitle}_${i}.wav`;
            const outputPath = path.join(OUTPUT_DIR, filename);

            if (!speakerId) {
                console.warn(`Skipping unknown character: ${item.character} in ${filename}`);
                continue;
            }

            if (!item.text) continue;

            // Check if file exists to skip? content might change so maybe overwrite.
            // For speed, let's overwrite.

            console.log(`Generating ${filename}...`);
            try {
                await generateVoice(item.text, speakerId, outputPath);
            } catch (e) {
                console.error(`Error generating ${filename}: ${e.message}`);
            }
        }
    }
    console.log("All done!");
}

main().catch(console.error);
