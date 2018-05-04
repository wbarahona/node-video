//
// Gulpfile.js
// Recipe by Willmer Barahona
// -----------------------------------------------------------------------
// task related
import gulp from 'gulp';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import { argv } from 'yargs';
import prettyTime from 'pretty-hrtime';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';

// front end server related
import connect from 'gulp-connect';

// view/html/templating related
import handlebars from 'gulp-compile-handlebars';

// scripts and lint related
import eslint from 'gulp-eslint';
import browserify from 'browserify';
import watchify from 'watchify';
import glob from 'glob';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify-es';
import babelify from 'babelify';

// Styles related
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import combinemq from 'gulp-combine-mq';

// Image related
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

// application configurations
import paths from './app/config/paths.ini';
import web from './app/config/web.conf';
import helpers from './app/config/helpers.conf';

//
// Internals
// -----------------------------------------------------------------------
const internals = {
    web: web,
    pathsDev: paths.dev.client,
    pathsDist: paths.dist.client,
    hbs: {
        helpers: helpers
    }
};
const { hbs } = internals;

hbs.options = {
    ignorePartials: true,
    batch: [internals.pathsDev.hbs.partials],
    helpers: internals.hbs.helpers
};

//
// Notify when task has done
// -----------------------------------------------------------------------
gulp.on('task_stop', (e) => {

    const quiet = (argv.quiet) ? true : false;

    if (!quiet) {

        const time = prettyTime(e.hrDuration);

        gulp.src('').pipe(notify({
            title: `Finished: ${ e.task.toUpperCase() }`,
            message: `after ${ time }`
        }));
    }
});

//
// Connect task
// -----------------------------------------------------------------------
gulp.task('connect', () => {

    connect.server({
        root: internals.pathsDist.root,
        port: 8000,
        livereload: true
    });
});

//
// Swallow Error
// -----------------------------------------------------------------------
const swallowError = (error) => {
    console.log(error.toString());
    this.emit('end');
};

//
// Process scripts
// -----------------------------------------------------------------------
const buildDir = (entry) => {

    const newstring = entry.replace(internals.pathsDev.scripts, '');
    const lastOccurrenceIndex = newstring.lastIndexOf('/');
    const dir = newstring.slice(0, lastOccurrenceIndex + 1);

    return dir;
};

const bundleScript = (file) => {

    const opts = Object.assign({}, watchify.args, {
        debug: true,
        entries: file
    });
    const lint = (src) => {

        return gulp.src(src)
            .pipe(eslint({ useEslintrc: true }))
            .pipe(eslint.format());
    };
    let brw = browserify(opts);
    const rebundle = () => {

        return brw.bundle()
            .on('error', gutil.log.bind(gutil, '>>> Bundling error!'))
            .pipe(source(file))
            .pipe(buffer())
            .pipe(uglify({ mangle: {reserved: ['jQuery']} }))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(rename({
                dirname: buildDir(file),
                extname: '.min.js'
            }))
            .pipe(gulp.dest(internals.pathsDist.scripts))
            .pipe(notify({
                title: 'Finished: BUNDLING > '
            }))
            .pipe(connect.reload());
    };

    brw.transform(babelify.configure({
        global: true,
        compact: false
    }));
    brw = watchify(brw);
    brw.on('update', (id) => {
        lint(id);
        rebundle();
    });

    return rebundle();
};

gulp.task('scripts', () => {

    glob(`${ internals.pathsDev.scripts }/**/*.js`,
        {'ignore': [`${ internals.pathsDev.scripts }/modules/**/*`, `${ internals.pathsDev.scripts }/libs/**/*`]},
        (err, files) => {

            if (err) {swallowError(err);}
            files.map((entry) => {
                bundleScript(entry);
            });
        });
});

//
// Process Styles
// -----------------------------------------------------------------------
gulp.task('sass', () => {

    const sassOptions = {
        errLogToConsole: true
    };

    return gulp.src([`${ internals.pathsDev.styles }/styles.scss`])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(combinemq())
        .pipe(cssnano({
            autoprefixer: { browsers: ['last 3 version'], add: true }
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest(internals.pathsDist.styles))
        .pipe(connect.reload());
});

//
// Process images
// -----------------------------------------------------------------------
gulp.task('images', () => {

    return gulp.src(`${ internals.pathsDev.images }/**/*`)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(internals.pathsDist.images))
        .pipe(connect.reload());
});

//
// Process font files
// -----------------------------------------------------------------------
gulp.task('fonts', () => {

    return gulp.src(`${ internals.pathsDev.fonts }/**/*`)
        .pipe(gulp.dest(internals.pathsDist.fonts))
        .pipe(connect.reload());
});

//
// Process templates
// -----------------------------------------------------------------------
gulp.task('templates', () => {

    return gulp.src([`${ internals.pathsDev.hbs.root }/**/*.hbs`, `!${ internals.pathsDev.hbs.partials }/**/*.hbs`])
        .pipe(handlebars(internals.web, hbs.options))
        .pipe(rename((path) => {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(internals.pathsDist.root))
        .pipe(connect.reload());
});

//
// Watch changes
// -----------------------------------------------------------------------
gulp.task('watch', () => {

    gulp.watch([`${ internals.pathsDev.hbs.root }/**/*.hbs`], ['templates']);
    gulp.watch([`${ internals.pathsDev.styles }/**/*.scss`], ['sass']);
    gulp.watch([`${ internals.pathsDev.images }/**/*`], ['images']);
});

//
// Default Task
// -----------------------------------------------------------------------
gulp.task('default', ['connect', 'templates', 'sass', 'images', 'fonts', 'scripts', 'watch']);
