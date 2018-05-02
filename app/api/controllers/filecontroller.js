import handlers from '../handlers';
import joi from 'joi';

const ThisModule = {};
const { filehandler } = handlers;

ThisModule.savefile = {
    handler: filehandler.savefile,
    description: 'Saves a video into the local directory',
    notes: 'Will save a mp4 video file into the local directory sent by the user, if you need a different typefile check the handler, and change its content-type header to the filetype you want',
    tags: ['api', 'file', 'upload', 'save'],
    plugins: {
        'hapi-swagger': {
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            file: joi.any()
                .meta({ swaggerType: 'file' })
                .description('video mp4 file')
        }
    },
    payload: {
        maxBytes: 40000000,
        parse: true,
        output: 'stream'
    },
    response: {
        schema: filehandler.schema.file
    },
    auth: false
};

ThisModule.youtube = {
    handler: filehandler.youtube,
    description: 'Fetches a youtube url and saves the video, then split it',
    notes: 'Will go fetch a youtube url then save a mp4 video file into the local directory, then will call the file service to split it into 30s pieces',
    tags: ['api', 'youtube', 'get', 'video'],
    validate: {
        payload: {
            url: joi.string()
                .required()
                .regex(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)
                .description('youtube URL')
                .example('https://www.youtube.com/watch?v=CTmYL1hzyts')
        }
    },
    response: {
        schema: filehandler.schema.file
    },
    auth: false
};

export default ThisModule;
