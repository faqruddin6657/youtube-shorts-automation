import { exec } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Paths
const srtPath = resolve(__dirname, 'output.srt');
const assPath = resolve(__dirname, 'output.ass');

// Correct FFmpeg command - single line
const ffmpegCmd = `ffmpeg -y -i "${srtPath}" -metadata:s:s:0 title=Default -metadata:s:s:0 language=eng -scodec ass "${assPath}"`;

exec(ffmpegCmd, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Error converting SRT to ASS:', err);
    console.error(stderr);
    return;
  }
  console.log('✅ SRT converted to ASS:', assPath);
});
