import filecontroller from '../controllers/filecontroller';

let ThisModule = [];

ThisModule = [
    {
        // Post a file
        method: 'POST',
        path: '/api/v1/file/',
        config: filecontroller.savefile
    },
    {
        // Post a file
        method: 'POST',
        path: '/api/v1/youtube/',
        config: filecontroller.youtube
    }
];

export default ThisModule;
