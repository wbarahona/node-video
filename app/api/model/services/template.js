import Handlebars from 'handlebars';
import helpers from 'handlebars-helpers';
import Templates from '../../templates';

const ThisModule = {};

ThisModule.replacevars = (tplstring, entities) => {
    const rx = /\{\{(.*?)\}\}/g;
    let output = null;

    if (entities) {
        const objresolve = (path, obj) => {
            return path.split('.').reduce((prev, curr) => {
                return prev ? prev[curr] : undefined;
            }, obj || self);
        };

        output = tplstring.replace(rx, (entity) => {
            return objresolve(entity.slice(2, -2), entities);
        });
    } else {
        output = tplstring;
    }

    return output;
};

ThisModule.template = (source, data) => {
    ThisModule.register();
    const compiled = Handlebars.compile(source);

    return compiled(data);
};

ThisModule.gettemplate = (name, entities) => {
    const { template } = ThisModule;

    return template(Templates[name], entities);
};

ThisModule.register = () => {
    helpers({
        handlebars: Handlebars
    });
};

export default ThisModule;
