import fs from 'fs';
import conf from './app/config';
import api from './app/api';

const { init } = api;
const { manifest } = conf('/');
const options = {
    relativeTo: __dirname
};

//
// Check if required folders exists, if false then create the
// public/uploads directory within the project's root
// then create the /public folder on the client dist directory,
// they are ignored in the gitignore because contain user uploads
// and we don't need those in the repo right?

if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
    fs.mkdirSync('./public/uploads');
}

if (!fs.existsSync('./app/client/dist')) {
    fs.mkdirSync('./app/client/dist');
    fs.mkdirSync('./app/client/dist/public');
}

global.__basedir = __dirname;

init(manifest, options);

export default api;
