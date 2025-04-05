#include <iostream>
#include <cstdlib>

int main() {
    // Paths to your input video, subtitle file, and output video
    std::string inputVideo = "temp/spkr-and-bg.mp4";
    std::string subtitleFile = "audio-to-text/final.ass";
    std::string outputVideo = "temp/video-with-sub.mp4";

    // FFmpeg command to burn .ass subtitles
    std::string command = "ffmpeg -y -i \"" + inputVideo + "\" -vf \"ass='" + subtitleFile + "'\" -c:a copy \"" + outputVideo + "\"";

    // Execute the command
    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "Subtitles burned successfully!" << std::endl;
    } else {
        std::cerr << "Failed to burn subtitles." << std::endl;
    }

    return 0;
}
