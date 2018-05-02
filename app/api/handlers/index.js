import Path from 'path';
import Fs from 'fs';

const Handlers = {};

Fs.readdirSync(__dirname).forEach((file) => {
    const handlerName = Path.basename(file, '.js');

    if (handlerName !== 'index') {
        Handlers[handlerName] = require(Path.join(__dirname, file)).default;
    }
});

export default Handlers;
