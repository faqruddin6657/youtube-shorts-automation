const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const inputDir = 'cinematic-vertical';
const outputDir = 'standardized';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const outputFrameRate = 30;
const outputBitrate = '2000k';
const outputResolution = '1080x1920';

fs.readdir(inputDir, async (err, files) => {
  if (err) return console.error(' Error reading directory:', err);

  const videoFiles = files.filter(file =>
    ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(path.extname(file).toLowerCase())
  );

  if (videoFiles.length === 0) return console.log(' No video files found.');

  let count = 1;
  for (const file of videoFiles) {
    const inputPath = path.join(inputDir, file);
    const outputFile = `standard_${count++}.mp4`;
    const outputPath = path.join(outputDir, outputFile);

    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -map 0:v:0? -map 0:a:0? -r ${outputFrameRate} -b:v ${outputBitrate} -vf scale=${outputResolution} -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k "${outputPath}"`;

    console.log(`🚀 Converting: ${file} -> ${outputFile}`);
    try {
      const { stdout, stderr } = await execPromise(ffmpegCmd);
      console.log(`✅ Saved: ${outputFile}`);
    } catch (err) {
      console.error(`❌ Failed to convert ${file}: ${err.message}`);
    }
  }

  console.log(' All videos standardized and saved in the "standardized" folder.');
});
