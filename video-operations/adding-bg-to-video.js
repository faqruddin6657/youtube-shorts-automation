// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');
import fs from 'fs';
import path from 'path';
import {exec} from 'child_process'


const audioFolder = 'bg_1min';
const inputVideo = 'temp/video.mp4';
const outputVideo = 'temp/video-with-bg.mp4';

function getRandomAudioFile(folder) {
  const files = fs.readdirSync(folder).filter(file => /\.(mp3|wav|aac)$/i.test(file));
  if (files.length === 0) {
    console.error('No audio files found in the folder.');
    process.exit(1);
  }
  return path.join(folder, files[Math.floor(Math.random() * files.length)]);
}

function mergeBackgroundAudio() {
  const randomAudio = getRandomAudioFile(audioFolder);

  const ffmpegCommand = `ffmpeg -i "${inputVideo}" -i "${randomAudio}" -filter_complex "[1:a]volume=0.3[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest "${outputVideo}"`;

  console.log(`Merging ${randomAudio} with ${inputVideo}...`);

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    console.log(`✅ Audio merged successfully! Output: ${outputVideo}`);
  });
}

mergeBackgroundAudio();

export {mergeBackgroundAudio}
