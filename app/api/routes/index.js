import Path from 'path';
import Fs from 'fs';

let RoutesModule = null;
let Routes = [];
let Route = null;

Fs.readdirSync(__dirname).forEach((file) => {
    const routeName = Path.basename(file, '.js');

    if (routeName !== 'index') {
        Route = require(Path.join(__dirname, file)).default;

        Routes = Routes.concat(Route);
    }
});

RoutesModule = () => Routes;

export default RoutesModule;
