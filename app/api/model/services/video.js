import ffmpeg from 'fluent-ffmpeg';
import ffmpeginstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeinstaller from '@ffprobe-installer/ffprobe';
import Promise from 'promise';
import fs from 'fs';

const res = './public/uploads';
const output = './app/client/dist/public';
const ffmpegpath = ffmpeginstaller.path;
const ffprobepath = ffprobeinstaller.path;

const ThisModule = {};
const response = {
    code: 0,
    message: '',
    content: {}
};

ffmpeg.setFfmpegPath(ffmpegpath);
ffmpeg.setFfprobePath(ffprobepath);

//
// Get video length
// -------------------------------------------------------
ThisModule.getVideoLenght = async (filename, ext) => {
    const src = `${ res }/${ filename }.${ ext }`;

    const promise = new Promise((resolve) => {
        ffmpeg.ffprobe(src, (err, data) => {
            let videoLen = 0;

            videoLen = Math.floor(data.format.duration);

            resolve(videoLen);
        });
    });

    return promise;
};

//
// Process this video from time x to duration y
// -------------------------------------------------------
ThisModule.processVideo = async (filename, startTime, duration, outputName, ext) => {
    const src = `${ res }/${ filename }.${ ext }`;
    const thisConceptPath = `${ output }/${ filename }`;
    const finalOutputPath = `${ thisConceptPath }/${ outputName }`;

    if (!fs.existsSync(thisConceptPath)) {
        fs.mkdirSync(thisConceptPath);
    }

    const promise = new Promise((resolve, reject) => {
        ffmpeg(src)
            .output(`${ finalOutputPath }.${ ext }`)
            .setStartTime(startTime)
            .setDuration(duration)
            .on('end', () => {
                resolve('Video processed');
            })
            .on('error', (err) => {
                reject(`Error: ${ err }`);
            })
            .run();
    });

    return promise;
};

//
// Chop the video in looped pieces
// -------------------------------------------------------
ThisModule.chopVideo = async (filename, ext, videoLen, duration) => {
    const processedPieces = [];
    let piecesLen = 0;
    let secondsCount = 0;
    let orderIndex = 1;
    let responsePieces = null;
    let lastPieceLen = 0;

    console.log('Processing videos...');

    try {
        piecesLen = Math.floor(videoLen / duration);

        for (let i = 0; i < piecesLen; i++) {
            processedPieces.push(ThisModule.processVideo(filename, secondsCount, duration, `${filename}${ orderIndex }`, ext));

            secondsCount += duration;
            orderIndex++;
        }

        lastPieceLen = videoLen - secondsCount;

        // check if there is still a processable piece longer than 3s?
        if (secondsCount < videoLen && lastPieceLen > 3 && lastPieceLen < 29) {
            processedPieces.push(ThisModule.processVideo(filename, secondsCount, lastPieceLen, `${filename}${ orderIndex }`, ext));
        }

        const piecesPromise = await Promise.all(processedPieces);

        responsePieces = piecesPromise;
    } catch (err) {
        response.message = 'there was an error!';
        console.log(err);
    }

    return responsePieces;
};

//
// bootstrap the nodejs app
// -------------------------------------------------------
ThisModule.init = async (videoname, ext) => {
    const videoLen = await ThisModule.getVideoLenght(videoname, ext);

    if (videoLen > 34 && videoLen < 360) {
        const videoChopped = await ThisModule.chopVideo(videoname, ext, videoLen, 30);
        const chopLen = videoChopped.length;

        // OBSERVATION: with the videoChopped array we can do a
        // checksum of processed videos and send a response to
        // the client regarding what videos were successfully processed,
        // maybe a reason but I highly doubt the client is willing to fix one
        // single video, he/she may want to reprocess the whole video
        if (videoChopped.length > 0 && videoChopped[chopLen - 1] === 'Video processed') {
            response.code = 1;
            response.message = 'Done processing videos!';
            response.content = videoChopped;
        } else if (videoChopped.length > 0) {
            response.code = 0;
            response.message = 'No video was processed!';
        }
    } else {
        response.code = 0;
        response.message = 'Video is too short or to long, please use a video with a lenght between 34 seconds and 6 mins!';
    }

    return response;
};

export default ThisModule;
