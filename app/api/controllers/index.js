import Path from 'path';
import Fs from 'fs';

const Controllers = {};

Fs.readdirSync(__dirname).forEach((file) => {
    const controllerName = Path.basename(file, '.js');

    if (controllerName !== 'index') {
        Controllers[controllerName] = require(Path.join(__dirname, file)).default;
    }
});

export default Controllers;
