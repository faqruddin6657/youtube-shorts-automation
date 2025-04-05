import express from 'express';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';



// upload_the_video("the myth the legend and so. on ", "really amazing guy");


function upload_the_video(title, desc) {

    // Fix __dirname for ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();
    const PORT = 4000;

    // Paths
    const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
    const TOKEN_PATH = path.join(__dirname, 'token.json');

    // Load OAuth2 client
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // OAuth entry point (just in case)
    app.get('/auth', (req, res) => {
        if (fs.existsSync(TOKEN_PATH)) return res.send('✅ Already authorized!');
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload']
        });
        res.redirect(authUrl);
    });

    // OAuth callback
    app.get('/oauth2callback', async (req, res) => {
        const { code } = req.query;
        if (!code) return res.status(400).send('❌ No code received');
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        res.send('✅ Authorization successful! Video will now upload automatically.');
        uploadingNow();
    });

    // ✅ Automated Upload Function
    async function uploadVideo(videoPath, title, description) {
        try {
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
            oAuth2Client.setCredentials(token);

            const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
            const response = await youtube.videos.insert({
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title,
                        description,
                        tags: ['motivation', 'shorts', 'viral'],
                        categoryId: '22' // People & Blogs
                    },
                    status: {
                        privacyStatus: 'public'
                    }
                },
                media: {
                    body: fs.createReadStream(videoPath)
                }
            });

            console.log(`✅ Video uploaded: https://www.youtube.com/watch?v=${response.data.id}`);
            process.exit(0);
        } catch (err) {
            console.error('❌ Video upload failed', err);
            process.exit(0);
        }
    }

    // 🚀 Auto-trigger upload on server start if token exists
    app.listen(PORT, async () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        uploadingNow();

    });




    async function uploadingNow() {
        if (fs.existsSync(TOKEN_PATH)) {
            console.log('✅ Token found. Uploading video...');
            // 👉 Customize your video path, title, description here:
            const videoPath = path.join(__dirname, '../temp/video-with-sub.mp4');  // << Put your video file here
            const videoTitle = title;
            const videoDesc = desc;

            await uploadVideo(videoPath, videoTitle, videoDesc);
        } else {
            console.log(`🔗 Visit http://localhost:${PORT}/auth to authorize the app`);
        }
    }

}


export { upload_the_video }