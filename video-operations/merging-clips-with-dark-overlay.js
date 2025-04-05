// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');
// const util = require('util');

import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';
import util from 'util';

import { fileURLToPath } from 'url';

// ✅ Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = util.promisify(exec);

// ✅ Update your directory paths
const clipsDir = path.join(__dirname, '../clips-5s');
const outputFile = path.join(__dirname, '../temp/video.mp4');
const CLIP_DURATION = 5; // Each clip is 5 seconds

async function mergeRandomClips(targetDurationSeconds) {
  try {
    const files = fs.readdirSync(clipsDir).filter(file =>
      ['.mp4', '.mov', '.avi', '.mkv'].includes(path.extname(file).toLowerCase())
    );

    if (files.length === 0) {
      console.error('❌ No video clips found in clips-5s folder.');
      return;
    }

    const clipsNeeded = Math.ceil(targetDurationSeconds / CLIP_DURATION);
    console.log(`🎯 Target Duration: ${targetDurationSeconds}s, Clips needed: ${clipsNeeded}`);

    // Randomly select clips
    const selectedClips = [];
    for (let i = 0; i < clipsNeeded; i++) {
      const randomClip = files[Math.floor(Math.random() * files.length)];
      selectedClips.push(randomClip);
    }

    // Create concat list for ffmpeg
    const concatListPath = path.join(__dirname, 'concat_list.txt');
    const concatListContent = selectedClips
      .map(file => `file '${path.join(clipsDir, file).replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatListContent);

    console.log('📄 Generated concat list:\n', concatListContent);

    // FFmpeg command with proper drawbox for dark overlay
    const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" ` +
      `-filter_complex "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.3:t=fill" ` +
      `-c:v libx264 -preset fast -crf 22 -c:a aac "${outputFile}"`;

    console.log('🚀 Merging clips with dark overlay...');
    await execPromise(ffmpegCmd);
    console.log('✅ Merge complete! Output saved as final_output.mp4');

  } catch (err) {
    console.error('❌ Error during processing:', err.message);
  } finally {
    // Cleanup
    const concatListPath = path.join(__dirname, 'concat_list.txt');
    if (fs.existsSync(concatListPath)) {
      fs.unlinkSync(concatListPath);
      console.log('🧹 Cleaned up temporary concat_list.txt');
    }
  }
}

// Example usage: Merge clips for a 60-second video
mergeRandomClips(60);

export {mergeRandomClips}
