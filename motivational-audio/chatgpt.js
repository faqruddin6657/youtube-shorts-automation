import OpenAI from "openai";
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
dotenv.config()


// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name (similar to __dirname)
const __dirname = path.dirname(__filename);



 chatgpt()




function chatgpt() {
    const motivationalQuotePrompt = "without decorations also(quotations) just Give me a short, powerful, and motivational speeche in hindi (less than 750 characters). Use simple words, make it attention-grabbing, and avoid unnecessary fluff. Keep it impactful and straight to the point--> make paragraphs not more than 250 characters-->(make only three paragraphs)"
    const openai = new OpenAI({
        apiKey: process.env.CHATGPT_API_KEY,
    });

    const completion = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            { "role": "user", "content": `  ${motivationalQuotePrompt} ` },
        ],
    });


    //  completion.then((result) => console.log("\n",result.choices[0].message.content),"\n");
    completion.then((result) => {
        const output = result.choices[0].message.content;
        // console.log(output);
        const para = output.split("\n")
        console.log(para);

        getTTS(para[0], "murf-1.mp3")
        getTTS(para[2], "murf-2.mp3")
        getTTS(para[4], "murf-3.mp3")


    });


}











function getTTS(text, filename) {
    const murf_apiKey = process.env.MURF_API_KEY
    let file_link;
    let data = JSON.stringify({
        "voiceId": "hi-IN-rahul",
        "style": "Conversational",
        "text": text,
        "rate": 0,
        "pitch": 0,
        "sampleRate": 48000,
        "format": "MP3",
        "channelType": "MONO",
        "pronunciationDictionary": {},
        "encodeAsBase64": false,
        "variation": 1,
        "audioDuration": 0,
        "modelVersion": "GEN2"
    });

    let config = {
        method: 'post',
        url: 'https://api.murf.ai/v1/speech/generate',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': murf_apiKey
        },
        data: data
    };

    axios(config)
        .then((response) => {
            //  console.log(response.data.audioFile);
            file_link = response.data.audioFile;
            const filePath = path.join(__dirname, "murf", filename);

            downloadAudio(file_link, filePath)
            // console.log(file_link);
        })
        .catch((error) => {
            console.log(error);
        });

}

async function downloadAudio(videoUrl, filePath) {
    try {
        // Send a GET request to fetch the video as a stream
        const videoResponse = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream',  // Get the video as a stream
        });

        // Create a writable stream to save the video in the local file system
        const writer = fs.createWriteStream(filePath);

        // Pipe the video stream to the writable stream
        videoResponse.data.pipe(writer);

        // Wait for the video to finish downloading
        writer.on('finish', () => {
            console.log('audio has been saved successfully at', filePath);


        });

        // Handle errors in downloading the video
        writer.on('error', (err) => {
            console.error('Error saving the audio:', err);
        });
    } catch (error) {
        console.error('Error downloading the audio:', error.message);
    }
}


export { getTTS }


export { chatgpt }

