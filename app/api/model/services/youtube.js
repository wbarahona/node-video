import fs from 'fs';
import youtubedl from 'youtube-dl';
import Promise from 'promise';
import config from '../../../config';

const ThisModule = {};
const response = {
    code: 0,
    message: '',
    content: {}
};
const credentials = config('/mail/clients/gmail');
const { username, password } = credentials;


//
// Internal function that will rand 20 chars string
// -----------------------------------------------------------------------
function rand () {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

//
// Internal function that will save the video to a location
// -----------------------------------------------------------------------
function downloadVideo (url) {
    const promise = new Promise((resolve, reject) => {
        try {
            const filepath = `${ __basedir }/public/uploads`;
            const randname = rand();

            const video = youtubedl(url,
                ['--format=18'],
                { cwd: filepath });

            video.pipe(fs.createWriteStream(`${ filepath }/${ randname }.mp4`));

            video.on('end', () => {
                resolve(`${ randname }`);
            });
        } catch (error) {
            reject(`Error downloading video: ${ error.message }`);
        }
    });

    return promise;
}

//
// Get the video info
// -----------------------------------------------------------------------
ThisModule.getytinfo = async (url) => {
    const options = [`--username=${ username }`, `--password=${ password }`];

    const promise = new Promise((resolve, reject) => {

        try {
            youtubedl.getInfo(url, options, (err, info) => {
                if (err) {throw err;}

                response.code = 1;
                response.message = 'Video info retrieved successfully';
                response.content = {
                    id: info.id,
                    title: info.title,
                    url: info.url,
                    thumbnail: info.thumbnail,
                    description: info.description,
                    filename: info._filename,
                    formatid: info.format_id,
                    durationraw: info._duration_raw
                };

                resolve(response);
            });
        } catch (error) {
            response.message = error.message;
            response.content = error;
            reject(response);
        }
    });

    return promise;
};

//
// Wrapper function to get the youtube video
// -----------------------------------------------------------------------
ThisModule.getytvideo = async (url) => {
    const promise = new Promise((resolve, reject) => {
        try {

            downloadVideo(url).then(resp => {
                response.code = 1;
                response.message = `Done, downloaded video to: ${ __basedir }/public/uploads/${ resp }`;
                response.content = {
                    videoname: resp
                };
                resolve(response);
            }, rej => {
                response.message = rej.message;
                reject(response);
            });
        } catch (error) {
            response.message = error.message;
            response.content = error;
            reject(response);
        }
    });

    return promise;
};

export default ThisModule;
