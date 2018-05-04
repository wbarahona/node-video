import joi from 'joi';
import FileService from '../model/services/file';
import YoutubeService from  '../model/services/youtube';
import VideoService from '../model/services/video';

const ItemsHandler = {};
let statusCode = 500;
let code = 0;
let message = '';
let content = {};

ItemsHandler.savefile = async (request, h) => {
    const { payload } = request;

    try {
        const fileResponse = await FileService.save(payload);

        statusCode = (fileResponse.code === 1) ? 200 : 500;
        code = fileResponse.code;
        message = fileResponse.message;
        content = fileResponse.content;
    } catch(err) {
        message = `File handler "savefile" operation was unsuccessful: ${ err.message }`;
        content = err;
    }

    return h.response({
        statusCode,
        code,
        message,
        content
    }).code(statusCode);
};

ItemsHandler.youtube = async (request, h) => {
    const { payload } = request;
    const { url } = payload;

    try {
        const ytinfoResponse =  await YoutubeService.getytinfo(url);
        const { id, title, thumbnail, description, filename, formatid, durationraw } = ytinfoResponse.content;

        if (ytinfoResponse.code === 1 && durationraw > 34 && durationraw < 360) {
            const youtubeResponse = await YoutubeService.getytvideo(url);

            if (youtubeResponse.code === 1) {
                const videoResponse = await VideoService.init(youtubeResponse.content.videoname, 'mp4');

                statusCode = (videoResponse.code === 1) ? 200 : 500;
                code = videoResponse.code;
                message = videoResponse.message;
                content = { piecesResponses: videoResponse.content, id: youtubeResponse.content.videoname, videoinfo: { id, title, thumbnail, description, filename, formatid, durationraw } };
            } else {
                statusCode = (youtubeResponse.code === 1) ? 200 : 500;
                code = youtubeResponse.code;
                message = youtubeResponse.message;
                content = youtubeResponse.content;
            }
        } else {
            code = 0;
            message = 'Video is too short or to long, please use a video with a lenght between 34 seconds and 6 mins!';
            content = { durationraw };
        }
    } catch(err) {
        message = `File handler "youtube" operation was unsuccessful: ${ err.message }`;
        content = err;
    }

    return h.response({
        statusCode,
        code,
        message,
        content
    }).code(statusCode);
};

//
// Schemas definition for Items
// -----------------------------------------------------------------
ItemsHandler.schema = {};

ItemsHandler.schema.file = joi.object().keys({
    statusCode: joi.number()
        .required()
        .integer()
        .description('This is the response code')
        .example(200),
    code: joi.number()
        .required()
        .integer()
        .description('This is the response code from the service')
        .example(0),
    message: joi.string()
        .required()
        .description('This is the response message from the service, it shall be passed to the reply')
        .example('This request was successful'),
    content: joi.object()
        .required()
        .description('This is the response content, this holds an object with the file properties')
        .example({name: 'Item1'})
}).label('file');

export default ItemsHandler;
