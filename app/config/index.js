import confidence from 'confidence';
import paths from './paths.ini';
import pack from '../../package';
import email from './credentials/emailCredentials';


//
// API configuration and global vars
// ------------------------------------------------------------------------
// TODO: implement a cache method

// ------------------------------------------------------------------------
// NOTE: email was sent to a unfindable file for reasons, but follow this
// structure below in the emailCredentials.json
// {
//   "clients": {
//     "server1": {
//       "username": "your.email@server1.com",
//       "password": "somepassword",
//       "name": "server1"
//     }
//   }
// }
// ------------------------------------------------------------------------

const conf = {
    paths: paths,
    env: process.env.NODE_ENV || 'dev',
    manifest: {
        server: {
            cache: false,
            port: 8001,
            host: 'localhost',
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true,
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            }
        },
        register: {
            plugins: [
                { plugin: 'vision' },
                { plugin: 'inert' },
                {
                    plugin: 'good',
                    options: {
                        ops: {
                            interval: 15000
                        },
                        reporters: {
                            myConsoleReporter: [{
                                module: 'good-console'
                            }, 'stdout']
                        }
                    }
                },
                {
                    plugin: 'hapi-swagger',
                    options: {
                        info: {
                            'title': 'API Documentation',
                            'version': pack.version
                        }
                    }
                },
                { plugin: 'hapi-auth-bearer-token' }
            ]
        }
    },
    mail: email,
    appname: pack.name
};

conf.store = new confidence.Store(conf);

const get = (key, opts = {}) => {

    const criteria = { ... conf, ... opts };

    return conf.store.get(key, criteria);
};

export default get;
