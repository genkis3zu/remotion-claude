#!/usr/bin/env node
/**
 * VOICEVOX 音声生成スクリプト
 *
 * 使用方法:
 *   node scripts/generate-voices.mjs
 *
 * 前提条件:
 *   - VOICEVOXがlocalhost:50021で起動していること
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'voices');
const SCRIPT_PATH = path.join(ROOT_DIR, 'src', 'data', 'script.ts');

const VOICEVOX_HOST = 'http://localhost:50021';
const FPS = 30;

// スピーカーID
const SPEAKERS = {
  zundamon: 3,
  metan: 2,
};

async function checkVoicevox() {
  try {
    const res = await fetch(`${VOICEVOX_HOST}/version`);
    if (res.ok) {
      const version = await res.text();
      console.log(`✅ VOICEVOX connected (version: ${version})`);
      return true;
    }
  } catch (e) {
    console.error('❌ VOICEVOXに接続できません');
    console.error('   VOICEVOXを起動してください: docker-compose up -d');
    return false;
  }
}

async function generateVoice(text, speakerId, outputPath) {
  // 音声クエリ取得
  const queryRes = await fetch(
    `${VOICEVOX_HOST}/audio_query?speaker=${speakerId}&text=${encodeURIComponent(text)}`,
    { method: 'POST' }
  );
  if (!queryRes.ok) throw new Error(`audio_query failed: ${queryRes.statusText}`);
  const query = await queryRes.json();

  // 音声合成
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

  // WAVの長さを計算（簡易版）
  const wavHeader = Buffer.from(audioBuffer.slice(0, 44));
  const sampleRate = wavHeader.readUInt32LE(24);
  const byteRate = wavHeader.readUInt32LE(28);
  const dataSize = audioBuffer.byteLength - 44;
  const duration = dataSize / byteRate;

  return duration;
}

function parseScriptData() {
  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  const lines = [];

  // 簡易パーサー
  const regex = /\{\s*id:\s*(\d+),\s*character:\s*"([^"]+)",\s*text:\s*"([^"]+)"[^}]*voiceFile:\s*"([^"]+)"/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    lines.push({
      id: parseInt(match[1]),
      character: match[2],
      text: match[3],
      voiceFile: match[4],
    });
  }

  return lines;
}

async function main() {
  console.log('='.repeat(50));
  console.log('VOICEVOX 音声生成スクリプト');
  console.log('='.repeat(50));

  if (!(await checkVoicevox())) {
    process.exit(1);
  }

  // 出力ディレクトリ作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // スクリプトデータ解析
  const scriptData = parseScriptData();
  console.log(`\n${scriptData.length} 件のセリフを処理します...\n`);

  const results = [];

  for (const line of scriptData) {
    const speakerId = SPEAKERS[line.character];
    if (!speakerId) {
      console.log(`⚠️ Unknown character: ${line.character}`);
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, line.voiceFile);
    console.log(`[${line.id}] ${line.character}: "${line.text.substring(0, 20)}..."`);

    try {
      const duration = await generateVoice(line.text, speakerId, outputPath);
      const frames = Math.ceil(duration * FPS);
      results.push({ id: line.id, duration, frames });
      console.log(`    ✅ ${duration.toFixed(2)}s → ${frames} frames`);
    } catch (e) {
      console.log(`    ❌ Error: ${e.message}`);
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(50));
  console.log('script.ts 更新用:');
  console.log('='.repeat(50));
  for (const r of results) {
    console.log(`ID ${r.id}: durationInFrames: ${r.frames}, // ${r.duration.toFixed(2)}s`);
  }
}

main().catch(console.error);
