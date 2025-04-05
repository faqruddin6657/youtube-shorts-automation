import { writeFileSync, unlinkSync } from 'fs';
import { exec } from 'child_process';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Absolute path to the murf folder
const murfPath = resolve(__dirname, 'murf');

// Create the ffmpeg list file content with absolute paths
const listContent = 
  `file '${join(murfPath, 'murf-1.mp3')}'\n` +
  `file '${join(murfPath, 'murf-2.mp3')}'\n` +
  `file '${join(murfPath, 'murf-3.mp3')}'\n`;

// Write the list file
writeFileSync('murf-files.txt', listContent);

// Run ffmpeg to merge
exec(`ffmpeg -f concat -safe 0 -i murf-files.txt -c copy motivational-audio/final-murf.mp3`, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Error:', err);
    console.error(stderr);
    return;
  }
  console.log('✅ Merge completed. Output saved as final-murf.mp3');
  unlinkSync('murf-files.txt'); // Cleanup the list file
});
