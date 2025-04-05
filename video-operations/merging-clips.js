const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// ✅ f-clips is one level up
const clipsDir = path.join(__dirname, '../clips-5s');
const outputFile = path.join(__dirname, '../temp/final_output.mp4');
const CLIP_DURATION = 5; // Each clip is 10 seconds

async function mergeRandomClips(targetDurationSeconds) {
  const files = fs.readdirSync(clipsDir).filter(file =>
    ['.mp4', '.mov', '.avi', '.mkv'].includes(path.extname(file).toLowerCase())
  );

  if (files.length === 0) {
    console.error('❌ No video clips found in f-clips folder.');
    return;
  }

  const clipsNeeded = Math.ceil(targetDurationSeconds / CLIP_DURATION);
  console.log(`🎯 Target Duration: ${targetDurationSeconds}s, Clips needed: ${clipsNeeded}`);

  const selectedClips = [];
  for (let i = 0; i < clipsNeeded; i++) {
    const randomClip = files[Math.floor(Math.random() * files.length)];
    selectedClips.push(randomClip);
  }

  const concatListPath = path.join(__dirname, 'concat_list.txt');
  const concatListContent = selectedClips
    .map(file => `file '${path.join(clipsDir, file).replace(/\\/g, '/')}'`)
    .join('\n');
  fs.writeFileSync(concatListPath, concatListContent);

  console.log('📄 Generated concat list:\n', concatListContent);

  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${outputFile}"`;
  try {
    console.log('🚀 Merging clips...');
    await execPromise(ffmpegCmd);
    console.log('✅ Merge complete! Output saved as final_output.mp4');
  } catch (err) {
    console.error('❌ Error during merging:', err.message);
  } finally {
    fs.unlinkSync(concatListPath);
  }
}

// Example: merge clips for 60 seconds video
mergeRandomClips(60);

export {mergeRandomClips}