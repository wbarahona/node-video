import Glue from 'glue';
import routes from './routes';
import InitService from './model/services/init';

//
// Bootstrap api here
// ----------------------------------------------------------
const ThisModule = {};
const { init, getApp } = InitService;

ThisModule.init = (manifest, options) => {
    (async () => {
        try {
            const Server = await Glue.compose(manifest, options);

            Server.route(routes(Server));

            await Server.start();
            if (!getApp()) {
                init();
            }
            console.log('Server started', Server.info.uri);
        } catch (err) {
            console.log('An error has happened!');
            console.log(err);
            process.exit(1);
        }
    })();
};

export default ThisModule;
