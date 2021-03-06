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

gulp.task('default', function (callback) {
    runSequence(
        'build',
        'watch',
        'nodemon',
        callback);
});

gulp.task('build', function (callback) {
    return runSequence(
        'build-client', 'build-server',
        callback
        );
});

gulp.task('build-client', function (callback) {
    return runSequence(
        'clean-client',
        'copy-jspm', 'build-client-ts', 'copy-html', 'build-css',
        callback
        );
});

gulp.task('build-server', function (callback) {
    return runSequence(
        'clean-server',
        'build-server-ts',
        callback
        );
});

gulp.task('copy-jspm', function () {
    return gulp.src(paths.jspmSource, {
        base: paths.clientSourceRoot
    }).pipe(gulp.dest(paths.clientOutputRoot));
});


var tsClientProject = typescript.createProject({
    sourceMap: true,
    target: "es6",
    module: "es2015",
    declaration: false,
    noImplicitAny: false,
    noExternalResolve: true,
    removeComments: true,
    noLib: false,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    experimentalAsyncFunctions: true,
    typescript: tsc
});

var tsServerProject = typescript.createProject({
    sourceMap: true,
    target: "es6",
    module: "commonjs",
    declaration: false,
    noImplicitAny: false,
    noExternalResolve: true,
    removeComments: true,
    noLib: false,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    experimentalAsyncFunctions: true,
    typescript: tsc
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
        .pipe(typescript(tsClientProject))
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

gulp.task('build-server-ts', function () {
    return gulp.src(paths.dtsSource.concat(paths.serverTsSource))
        .pipe(plumber())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(changed(paths.serverOutputRoot, { extension: '.js' }))
        .pipe(typescript(tsServerProject))
        .pipe(babel(assign({}, compilerOptions, {
            modules: 'common'
        })))
        .pipe(sourcemaps.write('.', { 
            includeContent: false,
            sourceRoot: function (file) {
                var filePath = file.sourceMap.file;
                var pathParts = filePath.split('/');
                for (var i = 0, filePath = ''; i < pathParts.length; i++)
                    filePath += '../';
                filePath += paths.serverSourceRoot;
                return filePath;
            }
        }))
        .pipe(gulp.dest(paths.serverOutputRoot));
});
