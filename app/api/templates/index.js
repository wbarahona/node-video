// import controllers from '../controllers';
import Path from 'path';
import Fs from 'fs';

const Templates = {};

Fs.readdirSync(__dirname).forEach((file) => {
    const routeName = Path.basename(file, '.js');

    if (routeName !== 'index') {
        Fs.readFile(Path.join(__dirname, file), 'utf8', (err, html) => {
            Templates[file] = html;
        });
    }
});

export default Templates;
