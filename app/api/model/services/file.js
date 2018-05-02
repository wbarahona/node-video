import Promise from 'promise';
import fs from 'fs';
import video from './video';

const ThisModule = {};
const response = {
    code: 0,
    message: '',
    content: {}
};

ThisModule.save = async (payload) => {
    const { file } = payload;

    const promise = new Promise((resolve, reject) => {
        try {
            if (file) {
                const headers = file.hapi.headers;
                const contType = headers['content-type'];
                const filename = file.hapi.filename;
                const uploadsPath = `${ __basedir }/public/uploads/${ filename }`;

                // check the content-type is video/mp4
                if (contType === 'video/mp4') {

                    file.pipe(fs.createWriteStream(uploadsPath));

                    video.init(filename.split('.')[0], 'mp4').then((res) => {
                        response.code = 1;
                        response.message = 'File handled correctly!';
                        response.content = {
                            filename,
                            contType,
                            'resolution': res
                        };

                        resolve(response);
                    }, (rej) => {
                        response.code = 1;
                        response.message = `File processing failed! ${ rej.message }`;
                    });
                } else {
                    response.code = 0;
                    response.message = 'Unsupported media type';
                    reject(response);
                }
            } else {
                response.code = 0;
                response.message = 'File is required';
                reject(response);
            }
        } catch(err) {
            response.message = `Save file operation was unsuccessful: ${ err.message }`;
            response.content = err;
            reject(response);
        }
    });

    return promise;
};

export default ThisModule;
