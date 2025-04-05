import { exec } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const videoPath = resolve(__dirname, '../temp/video-with-bg.mp4');
const audioPath = resolve(__dirname, '../motivational-audio/final-murf.mp3');
const outputPath = resolve(__dirname, '../temp/spkr-and-bg.mp4');

const ffmpegCmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -filter_complex "[0:a]volume=0.3[a0];[a0][1:a]amix=inputs=2:duration=shortest:normalize=0[mix];[mix]volume=5[aout]" -map 0:v -map "[aout]" -shortest -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "${outputPath}"`;

exec(ffmpegCmd, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Error:', err);
    console.error(stderr);
    return;
  }
  console.log('✅ Video and audio merged successfully! Output saved at:', outputPath);
});
























// import { exec } from 'child_process';
// import { resolve } from 'path';
// import { fileURLToPath } from 'url';

// // __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = resolve(__filename, '..');

// // File paths
// const videoPath = resolve(__dirname, '../temp/video-with-bg.mp4');
// const audioPath = resolve(__dirname, '../motivational-audio/final-murf.mp3');
// const outputPath = resolve(__dirname, '../temp/spkr-and-bg.mp4');

// // FFmpeg Command - Keep it single line to avoid issues
// const ffmpegCmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -filter_complex "[0:a]volume=0.3[a0];[a0][1:a]amix=inputs=2:duration=shortest[aout]" -map 0:v -map "[aout]" -shortest -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "${outputPath}"`;

// exec(ffmpegCmd, (err, stdout, stderr) => {
//   if (err) {
//     console.error('❌ Error:', err);
//     console.error(stderr);
//     return;
//   }
//   console.log('✅ Video and audio merged successfully! Output saved at:', outputPath);
// });


























// import { exec } from 'child_process';
// import { resolve } from 'path';
// import { fileURLToPath } from 'url';

// // __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = resolve(__filename, '..');

// // Paths
// const videoPath = resolve(__dirname, '../temp/video-with-bg.mp4');
// const audioPath = resolve(__dirname, '../motivational-audio/final-murf.mp3');
// const outputPath = resolve(__dirname, '../temp/spkr-and-bg.mp4');

// // FFmpeg Command (flattened)
// const ffmpegCmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -map 0:v:0 -map 1:a:0 -shortest -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "${outputPath}"`;

// exec(ffmpegCmd, (err, stdout, stderr) => {
//   if (err) {
//     console.error('❌ Error:', err.message);
//     console.error(stderr);
//     return;
//   }
//   console.log('✅ Video and audio merged successfully! Output saved as:', outputPath);
// });
