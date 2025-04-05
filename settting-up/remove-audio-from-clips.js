const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const inputDir = 'clips';
const outputDir = 'f-clips';

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to check if the video has an audio stream
async function hasAudioStream(filePath) {
  try {
    const { stdout } = await execPromise(`ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "${filePath}"`);
    return stdout.trim() !== ''; // If output is not empty, audio exists
  } catch (err) {
    console.error(`❌ Error checking audio for ${filePath}:`, err.message);
    return false;
  }
}

fs.readdir(inputDir, async (err, files) => {
  if (err) return console.error('❌ Error reading input directory:', err);

  const videoFiles = files.filter(file =>
    ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(path.extname(file).toLowerCase())
  );

  if (videoFiles.length === 0) return console.log('⚠️ No video files found.');

  let count = 1;
  for (const file of videoFiles) {
    const inputPath = path.join(inputDir, file);
    const outputFile = `f_clip_${count++}.mp4`;
    const outputPath = path.join(outputDir, outputFile);

    const audioExists = await hasAudioStream(inputPath);

    if (!audioExists) {
      console.log(`⚠️ No audio found in ${file}, copying as is.`);
      try {
        fs.copyFileSync(inputPath, outputPath);
        console.log(`✅ Copied: ${outputFile}`);
      } catch (copyErr) {
        console.error(`❌ Failed to copy ${file}:`, copyErr.message);
      }
      continue;
    }

    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -an -c:v copy "${outputPath}"`;

    console.log(`🔇 Removing audio: ${file} -> ${outputFile}`);
    try {
      await execPromise(ffmpegCmd);
      console.log(`✅ Audio removed and saved: ${outputFile}`);
    } catch (err) {
      console.error(`❌ Failed to remove audio from ${file}:`, err.message);
    }
  }

  console.log('🎉 Processing complete. Check the "f-clips" folder.');
});
