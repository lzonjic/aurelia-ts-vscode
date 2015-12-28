var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var typescript = require('gulp-typescript');
var tsc = require('typescript');
var babel = require('gulp-babel');
var compilerOptions = require('../babel-options');
var nodemon = require('nodemon');

var tsProject = typescript.createProject('./tsconfig.json', { typescript: tsc });

gulp.task('default', function (callback) {
    runSequence(
        'build',
        'watch',
        'nodemon',
        callback);
});

gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        'copy-jspm', 'build-client-ts', 'copy-html', 'build-css', 'build-server',
        callback
        );
});

gulp.task('watch', function (callback) {
    return runSequence(
        [
            'copy-jspm:watch', // currently only for config.js
            'build-client-ts:watch',
            'copy-html:watch',
            'build-css:watch',
            'build-server:watch'
        ],
        callback);
});

gulp.task('nodemon', function (callback) {
    return nodemon('--watch dist --ignore dist\\public dist\\server.js');
});

gulp.task('copy-jspm', function () {
    return gulp.src(paths.jspmSource, {
        base: paths.clientSourceRoot
    }).pipe(gulp.dest(paths.clientOutputRoot));
});

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-client-ts', function () {
    return gulp.src(paths.dtsSource.concat(paths.clientTsSource))
        .pipe(plumber())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(changed(paths.clientOutputRoot, { extension: '.js' }))
        .pipe(typescript(tsProject))
        .pipe(babel(assign({}, compilerOptions, {
            modules: 'amd'
        })))
        .pipe(sourcemaps.write({ includeContent: true }))
        .pipe(gulp.dest(paths.clientOutputRoot));
});

// copies changed html files to the output directory
gulp.task('copy-html', function () {
    return gulp.src(paths.htmlSource)
        .pipe(changed(paths.clientOutputRoot, { extension: '.html' }))
        .pipe(gulp.dest(paths.clientOutputRoot));
});

// copies changed css files to the output directory
gulp.task('build-css', function () {
    return gulp.src(paths.cssSource)
        .pipe(sourcemaps.init())
        .pipe(changed(paths.clientOutputRoot, { extension: '.css' }))
        .pipe(postcss([require('autoprefixer'), require('precss')]))
        .pipe(sourcemaps.write({ includeContent: true }))
        .pipe(gulp.dest(paths.clientOutputRoot));
});

gulp.task('build-server', function () {
    return gulp.src(paths.dtsSource.concat(paths.serverTsSource))
        .pipe(plumber())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(changed(paths.serverOutputRoot, { extension: '.js' }))
        .pipe(typescript(tsProject))
        .pipe(babel(assign({}, compilerOptions, {
            modules: 'common'
        })))
        .pipe(sourcemaps.write({ includeContent: true }))
        .pipe(gulp.dest(paths.serverOutputRoot));
});

// WATCH SECTION
gulp.task('copy-jspm:watch', function () {
    return gulp.watch(paths.clientJsSource, ['copy-jspm']);
});

gulp.task('build-client-ts:watch', function () {
    return gulp.watch(paths.clientTsSource, ['build-client-ts']);
});

gulp.task('copy-html:watch', function () {
    return gulp.watch(paths.htmlSource, ['copy-html']);
});

gulp.task('build-css:watch', function () {
    return gulp.watch(paths.cssSource, ['build-css']);
});

gulp.task('build-server:watch', function () {
    return gulp.watch(paths.serverTsSource, ['build-server']);
});
