"# youtube-shorts-automation" 

packages used---->>>> { ffmpeg, openAi, murfAi, cloudinary, deepgram.ai, googleapis}

--> this project takes 5s clips from the clips-5s and merge them randomly and make 1 min video (youtube short)
--> then it randomly chooses 1m background music from bg_1min folder
--> then we merge the video and background music to get 1 min video file with background music
--> then using chatGPT through openAI apis we prompt it to get motivational text for 1 minute video.
--> now we need a tts to get a audio file for the text ( so we use murf.ai) and we get the speaker audio tts file.
--> now we merge this tts audio with the clip where we have bg-music with the video 
--> now we have 1 minute video file with (speaker audio[tts], bg-music, and video)
--> now we also need subtitles( captions )===> for that we need SRT file-- for that we are using another apis--> deepgram
--> but deepgram accepts a public url for a video (but we have video on our local system) -- so we are using cloudinary apis
--> finally after getting the srt file we will have to convert the SRT file to .ass file so that we can add styles to our subtitles(captions)
--> to convert srt to ass we are using ffmpeg ..
--> now after getting the .ass file we need to burn the subtitles to our video file so again we are using ffmpeg..
--> ok now the video is ready for the upload 
--> now we need to use google apis to upload the video on youtube...
--> get your credential files from your google cloud project and add it in the project..
--> and you are good to go 
