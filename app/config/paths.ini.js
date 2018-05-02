import path from 'path';

const paths = {};

//
// API PATHS SHALL BE DECLARED HERE BOY!
// ---------------------------------------------------------------------------------------
// ROOT
paths.root = path.resolve(__dirname, './');
paths.here = '.';
paths.back = '..';

// APP
paths.app = {};
paths.app.root = `${ paths.root }/app`;
paths.app.api = `${ paths.app.root }/api`;

// MODELS
paths.model = {};
paths.model.root = `${ paths.app.api }/model`;
paths.services = {};
paths.services.root  = `${ paths.model.root }/services`;
paths.services.users = `${ paths.services.root }/user`;
paths.services.items = `${ paths.services.root }/item`;

// ROUTES
paths.routes = {};
paths.routes.root = `${ paths.app.api }/routes`;
paths.routes.users = `${ paths.routes.root }/user`;

//
// ALL ROUTES FOR CLIENTS GO HERE
// ---------------------------------------------------------------------------------------------
paths.client = {
    dev: {
        client: {
            scripts: './app/client/src/assets/scripts',
            fonts: './app/client/src/assets/fonts',
            images: './app/client/src/assets/img',
            styles: './app/client/src/assets/sass',
            hbs: {
                root: './app/client/src/assets/templates',
                partials: './app/client/src/assets/templates/partials'
            },
            root: './app/client/src'
        },
        admin: {
            scripts: './app/admin/src/assets/scripts',
            fonts: './app/admin/src/assets/fonts',
            images: './app/admin/src/assets/img',
            styles: './app/admin/src/assets/sass',
            hbs: {
                root: './app/admin/src/assets/templates',
                partials: './app/admin/src/assets/templates/partials'
            },
            root: './app/admin/src'
        }
    },
    dist: {
        client: {
            scripts: './app/client/dist/assets/scripts',
            fonts: './app/client/dist/assets/fonts',
            images: './app/client/dist/assets/img',
            styles: './app/client/dist/assets/css',
            root: './app/client/dist'
        },
        admin: {
            scripts: './app/admin/dist/assets/scripts',
            fonts: './app/admin/dist/assets/fonts',
            images: './app/admin/dist/assets/img',
            styles: './app/admin/dist/assets/css',
            root: './app/admin/dist'
        }
    }
};

export default paths;
