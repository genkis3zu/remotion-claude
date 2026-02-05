#!/usr/bin/env node
/**
 * WAVファイルを44100Hzに変換するスクリプト
 * fluent-ffmpegを使用
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VOICES_DIR = path.join(__dirname, '..', 'public', 'voices');

// Find ffmpeg in common locations
function findFFmpeg() {
  const possiblePaths = [
    'ffmpeg',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
  ];

  // Check winget installation path from registry
  try {
    const result = execSync('powershell -Command "[Environment]::GetEnvironmentVariable(\'Path\', \'Machine\')"', { encoding: 'utf-8' });
    const paths = result.split(';');
    for (const p of paths) {
      if (p.toLowerCase().includes('ffmpeg')) {
        possiblePaths.push(path.join(p, 'ffmpeg.exe'));
      }
    }
  } catch (e) {
    // ignore
  }

  for (const p of possiblePaths) {
    try {
      execSync(`"${p}" -version`, { stdio: 'pipe' });
      return p;
    } catch (e) {
      // try next
    }
  }
  return null;
}

async function main() {
  console.log('='.repeat(50));
  console.log('WAV Audio Converter (24kHz → 44.1kHz)');
  console.log('='.repeat(50));

  const ffmpegPath = findFFmpeg();
  if (!ffmpegPath) {
    console.error('❌ ffmpegが見つかりません');
    console.error('   新しいターミナルを開いて再試行するか、');
    console.error('   手動でffmpegのパスを指定してください。');
    process.exit(1);
  }
  console.log(`✅ ffmpeg: ${ffmpegPath}`);

  const files = fs.readdirSync(VOICES_DIR).filter(f => f.endsWith('.wav'));
  console.log(`\n${files.length}個のWAVファイルを変換します...\n`);

  for (const file of files) {
    const inputPath = path.join(VOICES_DIR, file);
    const tempPath = path.join(VOICES_DIR, `temp_${file}`);

    console.log(`変換中: ${file}`);

    try {
      // Convert to 44100Hz
      execSync(`"${ffmpegPath}" -y -i "${inputPath}" -ar 44100 "${tempPath}"`, { stdio: 'pipe' });

      // Replace original
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);

      console.log(`  ✅ 完了`);
    } catch (e) {
      console.log(`  ❌ エラー: ${e.message}`);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  console.log('\n変換完了！');
}

main().catch(console.error);
