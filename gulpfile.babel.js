import gulp from 'gulp';
import del from 'del';
import plumber from 'gulp-plumber'; // prevent to stop by compile errors
import gulpIf from 'gulp-if';
import pump from 'pump'; // Specified error
import path from 'path';
import notify from 'gulp-notify'; // notify on desktop
import browserSync from 'browser-sync';
import stylus from 'gulp-stylus'; // Stylus(AltCSS) to CSS
import cleanCSS from 'gulp-clean-css'; // minify CSS
import eslint from 'gulp-eslint'; // lint JavaScript sources
import babel from 'gulp-babel'; // downgrade ecma version for web browsers
import uglify from 'gulp-uglify'; // minify JavaScript
import ejs from 'gulp-ejs'; // template for html
import minifyHtml from 'gulp-minify-html';

const cssInject = true;

const paths = {
    src: path.relative('.', 'src'),
    dist: 'dist',
    bundleCss: 'dist/assets/style/bundle.css'
};

function toSrc(target) {
    return `${paths.src}/${target}`;
}

const src = {
    deps: [
        'node_modules/underscore/underscore-min.js',
        'node_modules/axios/dist/axios.min.js',
        'node_modules/vue/dist/vue.min.js',
        'node_modules/luxon/build/global/luxon.js',
        'node_modules/vue-datetime/dist/vue-datetime.js',
        'node_modules/vue-datetime/dist/vue-datetime.min.css',
    ],
    resources: [
        toSrc('robots.txt'),
        toSrc('favicon.ico'),
        toSrc('assets/img/*.*'),
        toSrc('assets/vendor/*.*')]
    ,
    html: [toSrc('*.html')],
    htmlWatch: [toSrc('*.html'), toSrc('assets/ejs/*.ejs')],
    script: toSrc('assets/script/*.js'),
    styleWatch: toSrc('assets/style/*.styl'),
    style: toSrc('assets/style/[^_]*.styl')
};

const isRelease = process.argv.indexOf('--release') >= 0;

export const clean = () => del([paths.dist]);

function browser() {
    return browserSync({
        server: {
            baseDir: paths.dist,
            index: 'index.html'
        }
    });
}
function reloadBrowser(cb) {
    browserSync.reload();
    cb();
}

export function copy() {
    return gulp.src(src.resources, { base: paths.src})
        .pipe(gulp.dest(paths.dist));
}

export function copyDeps() {
    return gulp.src(src.deps)
        .pipe(gulp.dest(`${paths.dist}/assets/vendor/`));
}

export function plumberWithNotify() {
    return plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    });
}

function html(callback) {
    gulp.src(src.html, { base: paths.src})
        .pipe(plumberWithNotify())
        .pipe(ejs({cssInject: cssInject}))
        .pipe(gulpIf(isRelease, minifyHtml({empty: true})))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => {
            if (cssInject) {
                del([paths.bundleCss]);
            }
            callback();
        });
}

function script(cb) {
    pump([
        gulp.src(src.script, { base: paths.src}),
        plumberWithNotify(),
        eslint(),
        eslint.format(),
        eslint.failAfterError(),
        babel(),
        gulpIf(isRelease, uglify()),
        gulp.dest(paths.dist)
        ],
        cb);
}

function style() {
    return gulp.src(src.style, { base: paths.src})
        .pipe(plumberWithNotify())
        .pipe(stylus())
        .pipe(gulpIf(isRelease, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest(paths.dist))
}

export function watchFiles() {
    gulp.watch(src.htmlWatch, gulp.series(style, html, reloadBrowser));
    gulp.watch(src.script, gulp.series(script, reloadBrowser));
    gulp.watch(src.styleWatch, gulp.series(style, html, reloadBrowser));
    gulp.watch(src.resources, gulp.series(copy, reloadBrowser));
}

export const build = gulp.series(clean, gulp.parallel(copyDeps, style, script, copy), html);

export const watch = gulp.series(build, gulp.parallel(browser, watchFiles));

export default build;
