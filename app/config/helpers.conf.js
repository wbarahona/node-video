//
// All helpers for handlebars will go here
// ---------------------------------------------------------------------------------------------
module.exports = {
    ucase: ( str ) => {
        return str.fn(this).toUpperCase();
    },
    if_eq: ( a, b, opts ) => {
        let result = null;

        if (a === b) {
            result = opts.fn(this);
        } else {
            result = opts.inverse(this);
        }

        return result;
    },
    if_neq: ( a, b, opts ) => {
        let result = null;

        if (a !== b) {
            result = opts.fn(this);
        } else {
            result = opts.inverse(this);
        }

        return result;
    },
    modulus: ( a, b, opts ) => {
        let result = null;

        if ((a + 1) % b === 0) {
            result = opts.fn(this);
        } else {
            result = opts.inverse(this);
        }

        return result;
    },
    template: ( folder, template ) => {
        const result = null;
        const fldr = folder.replace(/\//g, '_');
        const tpl = template.replace(/\//g, '_');

        const f = handlebars.Handlebars.partials[`${ fldr }/${ tpl }`];

        if (!f) {
            result = 'Partial not loaded';
        } else {
            result = new handlebars.Handlebars.SafeString(f);
        }

        return result;
    },
    compare: ( v1, op, v2, options ) => {
        const c = {
            eq: (vv1, vv2) => {
                return vv1 === vv2;
            },
            neq: (vv1, vv2) => {
                return vv1 !== vv2;
            },
            gt: (vv1, vv2) => {
                return vv1 > vv2;
            },
            gte: (vv1, vv2) => {
                return vv1 >= vv2;
            },
            lt: (vv1, vv2) => {
                return vv1 < vv2;
            },
            lte: (vv1, vv2) => {
                return vv1 <= vv2;
            },
            and: (vv1, vv2) => {
                return vv1 && vv2;
            },
            or: (vv1, vv2) => {
                return vv1 || vv2;
            }
        };

        if( Object.prototype.hasOwnProperty.call( c, op ) ) {
            return c[ op ].call( this, v1, v2 ) ? options.fn( this ) : options.inverse( this );
        }

        return options.inverse( this );
    }
};
