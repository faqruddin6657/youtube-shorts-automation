

import { createClient } from '@deepgram/sdk';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config()
const srt_deepgraam_api_key = process.env.DATAGRAM_API_KEY
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY
const cloudinary_api_secret =process.env.CLOUDINARY_API_SECRET

// ✅ Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aud_loc = path.join(__dirname, '../motivational-audio/final-murf.mp3');


cloudinary_and_deepgram_srt()


async function cloudinary_and_deepgram_srt(){

  const audio_cloud= await uploadOnCloudinary();
console.log(" uploaded to cloudinary at : ", audio_cloud)
await deepgram_request(audio_cloud).then((value)=>{console.log(" received srt file for the video from - deepgram")})



}




// ++++++++++++++++++++++++++++++ below code is to upload the file on cloudinary ++++++++++++


async function uploadOnCloudinary() {

 
    cloudinary.config({ 
        cloud_name: 'dkfxvcd47', 
        api_key: cloudinary_api_key, 
        api_secret: cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           aud_loc, {
               public_id: 'faq',
               resource_type:'auto'
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    // console.log(uploadResult.url);
    return uploadResult.url;
    
    
}








//+++++++++++++++++++++++++++++++++++ the below code is to get the srt text +++++++++++++++++++++++


async function deepgram_request(video_url){
  return new Promise((resolve)=>{
    const listen = async () => {
      const deepgramApiKey = srt_deepgraam_api_key;
      const url = video_url;
      const deepgram = createClient(deepgramApiKey);
    
      const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        { url },
        {
          model: 'general',
          language: 'hi',
        },
      );
    
      if (error) {
        console.error(error);
      } else {
        console.dir(result, { depth: null });
        resolve(result)
      }

      convertToSRT(result)
    }
    
    listen();


  })
  
  
}


// ========================== converting deepgram json to srt =========================



async function convertToSRT(deepgramResponse) {
    const words = deepgramResponse.results.channels[0].alternatives[0].words;
    
    let srt = '';
    let index = 1;

    for (let i = 0; i < words.length; i += 5) {  // Group 5 words per subtitle (customize as needed)
        const chunk = words.slice(i, i + 5);
        const start = chunk[0].start;
        const end = chunk[chunk.length - 1].end;
        const text = chunk.map(w => w.word).join(' ');

        srt += `${index}\n${secondsToSRTTime(start)} --> ${secondsToSRTTime(end)}\n${text}\n\n`;
        index++;
    }

    fs.writeFileSync('audio-to-text/output.srt', srt);
    console.log('SRT file created!');
    console.log(" the contents of the file are---------------");
    console.log(srt);
}

function secondsToSRTTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const iso = date.toISOString();
    return iso.substr(11, 8) + ',' + String((seconds % 1).toFixed(3)).substring(2).padEnd(3, '0');
}


//+++++++++++++++++++++++++++++++++++ burning the subitles on the video +++++++++++++++++++++



const burnSubtitles = () => {
  exec('ffmpeg -i "final-video/result.mp4" -vf "subtitles=output.srt" -c:a copy vid-with-subtitles.mp4', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }
    console.log('Subtitles burned successfully');

  });
};





export {cloudinary_and_deepgram_srt}