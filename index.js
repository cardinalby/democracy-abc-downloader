const youtubeMp3Converter = require('youtube-mp3-converter')
const episodes = require('./azbuka.json')
const sanitize = require("sanitize-filename");
const path = require('path');
const fs = require('fs');

const downloadsDir = './downloads';

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function formatTime(tMark) {
    const hours = Math.floor(tMark / 3600);
    const minutes = Math.floor((tMark - hours * 3600) / 60);
    const seconds = tMark - hours * 3600 - minutes * 60;
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}

async function main() {
    const convertLinkToMp3 = youtubeMp3Converter(downloadsDir)
    const wordsEpisodes = episodes.items.filter(episode => episode.t && episode.word);
    for (let i = 0; i < wordsEpisodes.length; ++i) {
        const episode = wordsEpisodes[i]
        const number = i + 1
        const numberPadSize = wordsEpisodes.length.toString().length
        const fileName = `${pad(number, numberPadSize)} ${sanitize(episode.word)}`;
        const filePath = path.join(downloadsDir, `${fileName}.mp3`);

        if (fs.existsSync(filePath)) {
            console.log(`Skipping (${number}/${wordsEpisodes.length}) "${episode.word}", already exists`)
            continue;
        }

        console.log(`Downloading (${number}/${wordsEpisodes.length}) "${episode.word}"...`)
        await convertLinkToMp3(
            `https://www.youtube.com/watch?v=${episode.videoId}`,
            {
                startTime: formatTime(episode.t),
                title: fileName
            })
    }
}

main().catch(reason => console.error(reason));