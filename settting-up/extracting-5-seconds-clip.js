const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const inputDir = 'clips';
const outputDir = 'clips-5s';
const clipDuration = 5; // ✅ Change this to set your clip duration

// Create the clips folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function getVideoDuration(filePath) {
  try {
    const { stdout } = await execPromise(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
    return parseFloat(stdout.trim());
  } catch (err) {
    console.error(`❌ Error fetching duration for ${filePath}:`, err.message);
    return 0;
  }
}

fs.readdir(inputDir, async (err, files) => {
  if (err) return console.error('❌ Error reading directory:', err);

  const videoFiles = files.filter(file =>
    ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(path.extname(file).toLowerCase())
  );

  if (videoFiles.length === 0) return console.log('⚠️ No video files found.');

  let count = 1;
  for (const file of videoFiles) {
    const inputPath = path.join(inputDir, file);
    const outputFile = `clip_${count++}.mp4`;
    const outputPath = path.join(outputDir, outputFile);

    const duration = await getVideoDuration(inputPath);
    if (duration === 0) {
      console.error(`❌ Skipping ${file} due to unknown or zero duration.`);
      continue;
    }

    // ✅ If video is shorter than the clip duration, just copy it
    if (duration <= clipDuration) {
      fs.copyFileSync(inputPath, outputPath);
      console.log(`✅ ${file} is less than ${clipDuration}s, copied as is.`);
      continue;
    }

    // ✅ Otherwise, cut the first 'clipDuration' seconds
    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -t ${clipDuration} -c:v libx264 -c:a aac "${outputPath}"`;
    console.log(`🎬 Cutting ${clipDuration}s clip: ${file} -> ${outputFile}`);
    try {
      await execPromise(ffmpegCmd);
      console.log(`✅ Saved: ${outputFile}`);
    } catch (err) {
      console.error(`❌ Failed to clip ${file}:`, err.message);
    }
  }

  console.log(`🎉 All clips processed and saved in the "${outputDir}" folder.`);
});
