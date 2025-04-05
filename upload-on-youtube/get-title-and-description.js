import OpenAI from "openai";
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { upload_the_video } from "./upload.js";

import dotenv from 'dotenv'
dotenv.config()


// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name (similar to __dirname)
const __dirname = path.dirname(__filename);


chatgpt()


function chatgpt() {
    const motivationalQuotePrompt = "i am making a motivational youtube short .. give me only one title less than 70 characters.. which is attention grabbing and clickable ( no text decoration)--> followed by description(5 synonymous sentences without numbering for youtube seo ) with upto 30 tags one being #shorts. { no extra things like Title: or Description: }-->title,description,hastags seperated by only a single line"
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
        const title=para[0];
        const description= para[2].concat(para[4])
        console.log(description)
        upload_the_video(title,description)


    });


}

export { chatgpt }

