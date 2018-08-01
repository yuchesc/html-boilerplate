const gulp = require('gulp');

// Plugins
const runSequence = require('run-sequence'); // gulpタスク同期処理
const del = require('del'); // 生成ファイル削除
const plumber = require('gulp-plumber'); // コンパイルエラーでもプロセス継続
const gulpIf = require('gulp-if'); // if
const path = require('path'); // 相対パス指定
const notify = require('gulp-notify');
const browserSync = require('browser-sync'); // ファイル保存時にブラウザ自動リロード
const stylus = require('gulp-stylus'); // Stylus(AltCSS) to CSS
const cleanCSS = require('gulp-clean-css'); // CSS圧縮
const eslint = require('gulp-eslint'); // JS文法チェック
const babel = require('gulp-babel'); // ブラウザに優しくECMAバージョン下げる
const uglify = require('gulp-uglify'); // JS圧縮
const mocha = require('gulp-mocha'); // テストフレームワーク
const istanbul = require('gulp-istanbul'); // コードカバレッジ生成
const ejs = require('gulp-ejs'); // HTMLテンプレート


const src = path.relative('.', 'src'); // watch で相対パスを認識させる
const dist = 'dist';
const build = 'build';
const coverage = `${build}/coverage`;

const scriptDir = 'assets/script';
const scriptTarget = [`${src}/${scriptDir}/*.js`];

const styleDir = 'assets/style';
const styleTarget = [`${src}/${styleDir}/[^_]*.styl`];
const styleWatchTarget = [`${src}/${styleDir}/*.styl`];

const vendorDir = 'assets/vendor';
const vendorTarget = [`${src}/${vendorDir}/*.*`];

const imgDir = 'assets/img';
const imgTarget = [`${src}/${imgDir}/*.*`];

const htmlTarget = [`${src}/*.html`];
const htmlWatchTarget = [`${src}/*.html`, `${src}/ejs/*.ejs`];

const rootEtcTarget = [`${src}/robots.txt`, `${src}/favicon.ico`];

const testTarget = 'test/*.js';

// 引数が付いていたらリリース版（圧縮）とする
const isRelease = process.argv.indexOf('--release') >= 0;

function plumberWithNotify() {
    return plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    });
}

gulp.task('test', function () {
    return gulp.src(testTarget)
        .pipe(plumberWithNotify())
        .pipe(mocha())
        .pipe(istanbul.writeReports({dir: coverage}))
});

gulp.task('build-js', function () {
    return gulp.src(scriptTarget)
        .pipe(plumberWithNotify())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel())
        .pipe(gulpIf(isRelease, uglify()))
        .pipe(gulp.dest(`${dist}/${scriptDir}`));
});

gulp.task('browser-sync', () => {
    return browserSync({
        server: {
            baseDir: dist,
            index: 'index.html'
        }
    });
});

gulp.task('bs-reload', () => {
    return browserSync.reload();
});

gulp.task('build-vendor', () => {
    return gulp.src(vendorTarget)
        .pipe(gulp.dest(`${dist}/${vendorDir}`));
});

gulp.task('build-root-etc', () => {
    return gulp.src(rootEtcTarget)
        .pipe(gulp.dest(dist));
});

gulp.task('build-html', () => {
    return gulp.src(htmlTarget)
        .pipe(plumberWithNotify())
        .pipe(ejs())
        .pipe(gulp.dest(dist));
});

gulp.task('build-img', () => {
    return gulp.src(imgTarget)
        .pipe(gulp.dest(`${dist}/${imgDir}`));
});


gulp.task('build-css', () => {
    return gulp.src(styleTarget)
        .pipe(plumberWithNotify())
        .pipe(stylus())
        .pipe(gulpIf(isRelease, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest(`${dist}/${styleDir}`));
});

gulp.task('clean', (callback) => {
    return del([build, dist], callback);
});

gulp.task('default', ['clean'], (callback) => {
    runSequence('test', ['build-root-etc', 'build-vendor', 'build-js', 'build-css', 'build-img', 'build-html'], callback);
});

gulp.task('watch', () => {
    runSequence('default', 'browser-sync');
    gulp.watch(htmlWatchTarget, () => {
        runSequence('build-html', 'bs-reload');
    });
    gulp.watch(imgTarget, () => {
        runSequence('build-img', 'bs-reload');
    });
    gulp.watch(styleWatchTarget, () => {
        runSequence('build-css', 'bs-reload');
    });
    gulp.watch(scriptTarget, () => {
        runSequence('test', 'build-js', 'bs-reload');
    });
    gulp.watch(vendorTarget, () => {
        runSequence('build-vendor');
    });
    gulp.watch(rootEtcTarget, () => {
        runSequence('build-root-etc');
    });
});
