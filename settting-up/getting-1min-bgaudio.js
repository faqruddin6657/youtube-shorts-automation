const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const sourceDir = path.join(__dirname, '../backgound-music'); // Replace with your audio folder
const outputDir = path.join(__dirname, '../bg-1-min');
const allowedExtensions = ['.mp3', '.wav', '.m4a']; // Supported formats

// Create output directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
  console.log('📂 Created bg-audio folder.');
}

const files = fs.readdirSync(sourceDir).filter(file =>
  allowedExtensions.includes(path.extname(file).toLowerCase())
);

if (files.length === 0) {
  console.log('❌ No audio files found in the source folder.');
  process.exit(1);
}

const trimAudio = (inputPath, outputPath, index) => {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -y -i "${inputPath}" -ss 0 -t 60 -c copy "${outputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error trimming file ${index}:`, error.message);
        return reject(error);
      }
      console.log(`✅ Trimmed and saved: ${path.basename(outputPath)}`);
      resolve();
    });
  });
};

(async () => {
  console.log('🚀 Trimming and renaming audio files...');
  for (let i = 0; i < files.length; i++) {
    const inputFile = path.join(sourceDir, files[i]);
    const outputFile = path.join(outputDir, `${i + 1}${path.extname(files[i])}`);

    try {
      await trimAudio(inputFile, outputFile, i + 1);
    } catch (err) {
      console.error('Skipping this file due to error.');
    }
  }
  console.log('🎉 All audio files processed and saved to bg-audio.');
})();
