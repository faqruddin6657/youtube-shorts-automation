# 🎬 YouTube Shorts Automation

This project automates the creation and uploading of motivational YouTube Shorts using AI, audio, video processing, and cloud tools.

---

## 📦 Packages & Tools Used

- `ffmpeg`
- `openAI`
- `murf.ai`
- `cloudinary`
- `deepgram.ai`
- `googleapis`

---

## 🔁 Flow of Execution

```bash
node delete-temp.js
node video-operations/merging-clips-with-dark-overlay.js
node video-operations/adding-bg-to-video.js
node motivational-audio/chatgpt.js
node motivational-audio/merge-audio.js
node video-operations/adding-speaker-audio.js
node audio-to-text/getting-srt-file.js
node audio-to-text/srt-to-ass.js
node audio-to-text/adding-styles-to-ass-file.js
g++ burn.cpp -o burn
burn.exe
node upload-on-youtube/get-title-and-description.js
node delete-temp.js
pause

Got it! Here's your entire explanation rewritten and **beautifully formatted** in Markdown — ready to be dropped into your `README.md` on GitHub.

---

### 🎯 **How This Project Works – Step-by-Step**

This project **automatically creates a 1-minute motivational YouTube Short** using clips, music, AI-generated speech, subtitles, and uploads it — all through code!

---

#### 📌 Steps in Detail

1. 📂 **5-Second Clips Merging**
   - Takes multiple 5s clips from the `clips-5s` folder.
   - Randomly merges them to form a **1-minute video**.

2. 🎵 **Background Music Selection**
   - Randomly selects a 1-minute background music track from the `bg_1min` folder.
   - Merges it with the 1-minute video to produce a visually synced motivational clip.

3. 💬 **Generating Motivational Script**
   - Uses **ChatGPT (OpenAI API)** to generate a **motivational script** based on the video length (~1 min).

4. 🔊 **TTS Voiceover Generation**
   - Sends the script to **Murf.ai** to get a **TTS (Text-To-Speech) audio** file of a professional speaker’s voice.

5. 🎚️ **Final Audio Merge**
   - Merges the **speaker’s TTS audio** with the **background music + video**.
   - Now we have:  
     ✅ Video + 🎵 Music + 🎤 Voice-over

6. ✍️ **Generating Subtitles**
   - To add captions, we first need a **SRT subtitle file**.
   - For that, we use the **Deepgram API** which requires a **public video URL**.

7. ☁️ **Hosting for Subtitle Processing**
   - Since the video is on the local machine, we upload it to **Cloudinary** to generate a public link.
   - This link is then passed to **Deepgram** to generate the SRT file.

8. 🎨 **Styling Subtitles**
   - We convert the `.srt` file into `.ass` format (Advanced SubStation Alpha) using **FFmpeg**.
   - Then we apply **custom styles** to make the subtitles visually appealing.

9. 🔥 **Burning Subtitles into the Video**
   - The styled `.ass` subtitles are burned directly into the video using **FFmpeg**.

10. 📤 **Uploading to YouTube**
    - Uses **Google APIs** to upload the final video to your YouTube channel.
    - Make sure your **Google Cloud credentials** are set up properly in the project.

---

✅ After these steps, your motivational YouTube Short is **fully generated and uploaded**, completely hands-free!

Let me know if you want me to turn this into a collapsible FAQ style or add icons for each step 🔥
